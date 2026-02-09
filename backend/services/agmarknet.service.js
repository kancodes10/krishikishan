const axios = require('axios');

/**
 * Agmarknet Service
 * Fetches real-time mandi prices from Agmarknet API
 * Falls back to mock data when API is unavailable or USE_MOCK_DATA is enabled
 */

// Mock data for development and testing
const MOCK_MANDIS = [
    {
        name: 'Kolkata Mandi',
        state: 'West Bengal',
        district: 'Kolkata',
        lat: 22.5726,
        lng: 88.3639,
        prices: {
            onion: 1200,
            potato: 800,
            tomato: 1500,
            rice: 2200,
            wheat: 2000,
        },
    },
    {
        name: 'Howrah Mandi',
        state: 'West Bengal',
        district: 'Howrah',
        lat: 22.5958,
        lng: 88.2636,
        prices: {
            onion: 1350,
            potato: 850,
            tomato: 1600,
            rice: 2300,
            wheat: 2100,
        },
    },
    {
        name: 'Barasat Mandi',
        state: 'West Bengal',
        district: 'North 24 Parganas',
        lat: 22.7212,
        lng: 88.4826,
        prices: {
            onion: 1100,
            potato: 750,
            tomato: 1400,
            rice: 2100,
            wheat: 1900,
        },
    },
    {
        name: 'Durgapur Mandi',
        state: 'West Bengal',
        district: 'Paschim Bardhaman',
        lat: 23.5204,
        lng: 87.3119,
        prices: {
            onion: 1250,
            potato: 820,
            tomato: 1550,
            rice: 2250,
            wheat: 2050,
        },
    },
    {
        name: 'Siliguri Mandi',
        state: 'West Bengal',
        district: 'Darjeeling',
        lat: 26.7271,
        lng: 88.3953,
        prices: {
            onion: 1180,
            potato: 800,
            tomato: 1480,
            rice: 2180,
            wheat: 1980,
        },
    },
    {
        name: 'Asansol Mandi',
        state: 'West Bengal',
        district: 'Paschim Bardhaman',
        lat: 23.6739,
        lng: 86.9524,
        prices: {
            onion: 1220,
            potato: 810,
            tomato: 1520,
            rice: 2220,
            wheat: 2020,
        },
    },
];

/**
 * Fetch mandi prices for a specific crop
 * @param {string} crop - Crop name (e.g., 'onion', 'potato')
 * @param {object} sourceLocation - Farmer's location {lat, lng}
 * @returns {Promise<Array>} Array of mandi objects with prices
 */
async function getMandiPrices(crop, sourceLocation) {
    const useMockData = process.env.USE_MOCK_DATA === 'true' || !process.env.AGMARKNET_API_KEY;

    if (useMockData) {
        console.log('📦 Using mock data for Agmarknet (API key not configured)');
        return getMockMandiPrices(crop, sourceLocation);
    }

    try {
        // Real API implementation
        const response = await axios.get(process.env.AGMARKNET_BASE_URL, {
            params: {
                api_key: process.env.AGMARKNET_API_KEY,
                format: 'json',
                filters: {
                    commodity: crop,
                },
            },
            timeout: 5000,
        });

        // Transform API response to our format
        const mandis = transformAgmarknetResponse(response.data, crop);
        console.log(`✅ Fetched ${mandis.length} mandis from Agmarknet API`);
        return mandis;

    } catch (error) {
        console.warn('⚠️  Agmarknet API error:', error.message);
        console.log('📦 Falling back to mock data');
        return getMockMandiPrices(crop, sourceLocation);
    }
}

/**
 * Get mock mandi prices for development
 */
function getMockMandiPrices(crop, sourceLocation) {
    const cropLower = crop.toLowerCase();

    const mockResults = MOCK_MANDIS.map(mandi => {
        const price = mandi.prices[cropLower] || 1000; // Default price if crop not found

        return {
            name: mandi.name,
            state: mandi.state,
            district: mandi.district,
            location: {
                lat: mandi.lat,
                lng: mandi.lng,
            },
            price: price,
            pricePerQuintal: price,
            unit: 'Quintal',
            updatedAt: new Date().toISOString(),
            source: 'mock',
        };
    });

    // Add multiple dynamic "Local Mandis" near the user's location for demo purposes
    if (sourceLocation && sourceLocation.lat && sourceLocation.lng) {

        // 1. Very close, good price (The ideal choice)
        const latOffset1 = (Math.random() * 0.1 + 0.05) * (Math.random() > 0.5 ? 1 : -1);
        const lngOffset1 = (Math.random() * 0.1 + 0.05) * (Math.random() > 0.5 ? 1 : -1);

        mockResults.unshift({
            name: 'Local Market (Nearby)',
            state: 'Your State',
            district: 'Local District',
            location: {
                lat: sourceLocation.lat + latOffset1,
                lng: sourceLocation.lng + lngOffset1,
            },
            price: 1250,
            pricePerQuintal: 1250,
            unit: 'Quintal',
            updatedAt: new Date().toISOString(),
            source: 'mock-local',
        });

        // 2. Slightly further, higher price (Good alternative)
        const latOffset2 = (Math.random() * 0.2 + 0.15) * (Math.random() > 0.5 ? 1 : -1);
        const lngOffset2 = (Math.random() * 0.2 + 0.15) * (Math.random() > 0.5 ? 1 : -1);

        mockResults.unshift({
            name: 'District Main Mandi',
            state: 'Your State',
            district: 'Local District',
            location: {
                lat: sourceLocation.lat + latOffset2,
                lng: sourceLocation.lng + lngOffset2,
            },
            price: 1320, // Higher price
            pricePerQuintal: 1320,
            unit: 'Quintal',
            updatedAt: new Date().toISOString(),
            source: 'mock-local',
        });

        // 3. Further away, best price (High profit/high risk option)
        const latOffset3 = (Math.random() * 0.4 + 0.3) * (Math.random() > 0.5 ? 1 : -1);
        const lngOffset3 = (Math.random() * 0.4 + 0.3) * (Math.random() > 0.5 ? 1 : -1);

        mockResults.unshift({
            name: 'Regional Trading Center',
            state: 'Your State',
            district: 'Neighboring District',
            location: {
                lat: sourceLocation.lat + latOffset3,
                lng: sourceLocation.lng + lngOffset3,
            },
            price: 1450, // Best price
            pricePerQuintal: 1450,
            unit: 'Quintal',
            updatedAt: new Date().toISOString(),
            source: 'mock-local',
        });
    }

    return mockResults;
}

/**
 * Transform Agmarknet API response to our format
 */
function transformAgmarknetResponse(apiData, crop) {
    if (!apiData || !apiData.records) {
        return [];
    }

    return apiData.records.map(record => ({
        name: record.market,
        state: record.state,
        district: record.district,
        location: {
            lat: parseFloat(record.latitude) || 0,
            lng: parseFloat(record.longitude) || 0,
        },
        price: parseFloat(record.modal_price) || 0,
        pricePerQuintal: parseFloat(record.modal_price) || 0,
        unit: 'Quintal',
        updatedAt: record.arrival_date,
        source: 'agmarknet',
    })).filter(mandi => mandi.location.lat !== 0 && mandi.location.lng !== 0);
}

/**
 * Get available crops from mock data
 */
function getAvailableCrops() {
    return Object.keys(MOCK_MANDIS[0].prices);
}

module.exports = {
    getMandiPrices,
    getAvailableCrops,
};
