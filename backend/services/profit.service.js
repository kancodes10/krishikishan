/**
 * Profit Service
 * Core profit calculation engine
 * Calculates net profit considering revenue, transport, and handling costs
 */

// Vehicle rates per kilometer (in ₹)
const VEHICLE_RATES = {
    tractor: 12,
    'tata-ace': 18,
    truck: 25,
    'mini-truck': 20,
    tempo: 15,
};

// Handling charges (in ₹ per quintal)
const HANDLING_CHARGES = {
    loading: 20,
    unloading: 20,
    commission: 50, // Market commission
};

/**
 * Calculate profit for a single mandi option
 * @param {object} mandi - Mandi details with price and location
 * @param {number} distance - Distance in kilometers
 * @param {number} quantity - Crop quantity in quintals
 * @param {string} vehicleType - Type of vehicle
 * @param {number} customVehicleRate - Optional custom vehicle rate per km (overrides standard rates)
 * @returns {object} Profit breakdown
 */
function calculateProfit(mandi, distance, quantity, vehicleType, customVehicleRate = null) {
    // 1. Calculate Revenue
    const pricePerQuintal = mandi.price || mandi.pricePerQuintal;
    const revenue = pricePerQuintal * quantity;

    // 2. Calculate Transport Cost
    const vehicleRate = customVehicleRate !== null
        ? customVehicleRate
        : (VEHICLE_RATES[vehicleType.toLowerCase()] || VEHICLE_RATES.truck);
    const transportCost = distance * vehicleRate;

    // 3. Calculate Handling Costs
    const loadingCost = HANDLING_CHARGES.loading * quantity;
    const unloadingCost = HANDLING_CHARGES.unloading * quantity;
    const commissionCost = HANDLING_CHARGES.commission * quantity;

    const totalHandlingCost = loadingCost + unloadingCost + commissionCost;

    // 4. Calculate Total Cost
    const totalCost = transportCost + totalHandlingCost;

    // 5. Calculate Net Profit
    const netProfit = revenue - totalCost;

    // 6. Calculate profit per quintal
    const profitPerQuintal = netProfit / quantity;

    // 7. Calculate profit percentage
    const profitPercentage = (netProfit / revenue) * 100;

    return {
        mandiName: mandi.name,
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal
        price: pricePerQuintal,
        revenue: Math.round(revenue),
        transportCost: Math.round(transportCost),
        handlingCost: Math.round(totalHandlingCost),
        totalCost: Math.round(totalCost),
        netProfit: Math.round(netProfit),
        profitPerQuintal: Math.round(profitPerQuintal),
        profitPercentage: Math.round(profitPercentage * 10) / 10,
        breakdown: {
            loading: loadingCost,
            unloading: unloadingCost,
            commission: commissionCost,
            transport: transportCost,
        },
    };
}

/**
 * Calculate profits for multiple mandis
 * @param {Array} mandiDistances - Array of {destination, distance} objects
 * @param {number} quantity - Crop quantity in quintals
 * @param {string} vehicleType - Type of vehicle
 * @param {number} customVehicleRate - Optional custom vehicle rate per km
 * @returns {Array} Array of profit calculations
 */
function calculateMultipleProfits(mandiDistances, quantity, vehicleType, customVehicleRate = null) {
    return mandiDistances.map(item => {
        return calculateProfit(
            item.destination,
            item.distance,
            quantity,
            vehicleType,
            customVehicleRate
        );
    });
}

/**
 * Get vehicle rate per kilometer
 */
function getVehicleRate(vehicleType) {
    return VEHICLE_RATES[vehicleType.toLowerCase()] || VEHICLE_RATES.truck;
}

/**
 * Get all available vehicle types with rates
 */
function getAvailableVehicles() {
    return Object.entries(VEHICLE_RATES).map(([type, rate]) => ({
        type,
        ratePerKm: rate,
        displayName: type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    }));
}

/**
 * Calculate break-even distance
 * Distance at which a higher-priced mandi becomes profitable over local mandi
 */
function calculateBreakEvenDistance(localPrice, distantPrice, vehicleType, quantity) {
    const priceDifference = distantPrice - localPrice;
    const revenueGain = priceDifference * quantity;
    const vehicleRate = getVehicleRate(vehicleType);

    // Break-even when: revenueGain = distanceCost
    const breakEvenDistance = revenueGain / vehicleRate;

    return Math.round(breakEvenDistance * 10) / 10;
}

module.exports = {
    calculateProfit,
    calculateMultipleProfits,
    getVehicleRate,
    getAvailableVehicles,
    calculateBreakEvenDistance,
    VEHICLE_RATES,
    HANDLING_CHARGES,
};
