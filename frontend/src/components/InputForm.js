import React, { useState } from 'react';
import LocationSearch from './LocationSearch';
import './InputForm.css';

const InputForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        crop: 'onion',
        quantity: 20,
        vehicleType: 'truck',
        source: {
            lat: 22.5726,
            lng: 88.3639,
        },
    });

    const [gettingLocation, setGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [showManualInput, setShowManualInput] = useState(false);
    const [selectedLocationName, setSelectedLocationName] = useState('');
    const [customCrop, setCustomCrop] = useState('');
    const [showCustomVehicle, setShowCustomVehicle] = useState(false);
    const [customVehicle, setCustomVehicle] = useState({
        name: '',
        ratePerKm: '',
    });

    const crops = [
        { value: 'onion', label: 'Onion' },
        { value: 'potato', label: 'Potato' },
        { value: 'tomato', label: 'Tomato' },
        { value: 'rice', label: 'Rice' },
        { value: 'wheat', label: 'Wheat' },
        { value: 'other', label: '✏️ Other (Custom)' },
    ];

    const vehicles = [
        { value: 'tractor', label: 'Tractor (₹12/km)', icon: '🚜' },
        { value: 'tata-ace', label: 'Tata Ace (₹18/km)', icon: '🚐' },
        { value: 'truck', label: 'Truck (₹25/km)', icon: '🚛' },
        { value: 'mini-truck', label: 'Mini Truck (₹20/km)', icon: '🚚' },
        { value: 'tempo', label: 'Tempo (₹15/km)', icon: '🛻' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'lat' || name === 'lng') {
            setFormData({
                ...formData,
                source: {
                    ...formData.source,
                    [name]: parseFloat(value),
                },
            });
        } else if (name === 'quantity') {
            setFormData({
                ...formData,
                [name]: parseFloat(value),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            return;
        }

        setGettingLocation(true);
        setLocationError('');
        console.log('📍 Requesting GPS location...');

        const options = {
            enableHighAccuracy: true,
            timeout: 15000, // Increased to 15s
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = parseFloat(position.coords.latitude.toFixed(4));
                const lng = parseFloat(position.coords.longitude.toFixed(4));

                console.log(`✅ GPS Location found: ${lat}, ${lng}`);

                // Use functional update to avoid stale closure issues
                setFormData(prev => ({
                    ...prev,
                    source: { lat, lng },
                }));

                setSelectedLocationName(`GPS: ${lat}, ${lng}`);
                setGettingLocation(false);
                setLocationError('');
            },
            (error) => {
                console.error('❌ Geolocation error:', error);
                setGettingLocation(false);

                let errorMessage = 'Unable to get your location. ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Permission denied. Please allow location access.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Position unavailable. Try checking your network.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Request timed out (15s). Please try again.';
                        break;
                    default:
                        errorMessage += 'Please try search or manual input.';
                }
                setLocationError(errorMessage);
            },
            options
        );
    };

    const handleLocationSelect = (location) => {
        setFormData({
            ...formData,
            source: {
                lat: location.lat,
                lng: location.lng,
            },
        });
        setSelectedLocationName(location.name);
        setLocationError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Use custom crop name if "other" is selected
        const finalFormData = {
            ...formData,
            crop: formData.crop === 'other' ? customCrop.toLowerCase().trim() : formData.crop,
        };

        // Add custom vehicle if enabled and valid
        if (showCustomVehicle && customVehicle.name && customVehicle.ratePerKm) {
            finalFormData.customVehicle = {
                name: customVehicle.name.trim(),
                ratePerKm: parseFloat(customVehicle.ratePerKm),
            };
        }

        onSubmit(finalFormData);
    };

    return (
        <div className="input-form-container">
            <div className="form-header">
                <h1 className="form-title">
                    <span className="title-icon">🌾</span>
                    Krishi-Route
                </h1>
                <p className="form-subtitle">Google Maps for Farmers, optimized for <span className="highlight">PROFIT</span></p>
            </div>

            <form onSubmit={handleSubmit} className="optimization-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="crop">Crop Type</label>
                        <select
                            id="crop"
                            name="crop"
                            value={formData.crop}
                            onChange={handleChange}
                            className="form-control"
                            required
                        >
                            {crops.map(crop => (
                                <option key={crop.value} value={crop.value}>
                                    {crop.label}
                                </option>
                            ))}
                        </select>

                        {formData.crop === 'other' && (
                            <input
                                type="text"
                                placeholder="Enter crop name (e.g., corn, sugarcane, cotton)"
                                value={customCrop}
                                onChange={(e) => setCustomCrop(e.target.value)}
                                className="form-control custom-crop-input"
                                required
                                minLength="2"
                            />
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity">
                            Quantity (Quintals)
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="form-control"
                            min="0.1"
                            max="1000"
                            step="0.1"
                            required
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Vehicle Type</label>
                        <div className="vehicle-grid">
                            {vehicles.map(vehicle => (
                                <div
                                    key={vehicle.value}
                                    className={`vehicle-option ${formData.vehicleType === vehicle.value ? 'selected' : ''}`}
                                    onClick={() => setFormData({ ...formData, vehicleType: vehicle.value })}
                                >
                                    <span className="vehicle-icon">{vehicle.icon}</span>
                                    <span className="vehicle-label">{vehicle.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="custom-vehicle-toggle">
                            <button
                                type="button"
                                className="toggle-custom-vehicle-btn"
                                onClick={() => setShowCustomVehicle(!showCustomVehicle)}
                            >
                                {showCustomVehicle ? '❌ Remove Custom Vehicle' : '➕ Add Custom Vehicle'}
                            </button>
                        </div>

                        {showCustomVehicle && (
                            <div className="custom-vehicle-inputs">
                                <div className="custom-vehicle-header">
                                    <span className="custom-vehicle-icon">🚗</span>
                                    <span>Custom Vehicle Details</span>
                                </div>
                                <div className="vehicle-input-grid">
                                    <div className="vehicle-input-group">
                                        <label htmlFor="vehicleName">Vehicle Name</label>
                                        <input
                                            type="text"
                                            id="vehicleName"
                                            placeholder="e.g., My Truck, Rental Van"
                                            value={customVehicle.name}
                                            onChange={(e) => setCustomVehicle({ ...customVehicle, name: e.target.value })}
                                            className="form-control"
                                            required={showCustomVehicle}
                                        />
                                    </div>
                                    <div className="vehicle-input-group">
                                        <label htmlFor="vehicleRate">Mileage Rate (₹/km)</label>
                                        <input
                                            type="number"
                                            id="vehicleRate"
                                            placeholder="e.g., 30"
                                            value={customVehicle.ratePerKm}
                                            onChange={(e) => setCustomVehicle({ ...customVehicle, ratePerKm: e.target.value })}
                                            className="form-control"
                                            min="1"
                                            max="200"
                                            step="0.5"
                                            required={showCustomVehicle}
                                        />
                                    </div>
                                </div>
                                {customVehicle.ratePerKm && (
                                    <div className="vehicle-cost-preview">
                                        <span className="preview-icon">💰</span>
                                        <span>Cost for 100km: ₹{(parseFloat(customVehicle.ratePerKm) * 100).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="form-group full-width location-section">
                        <div className="location-header">
                            <label>📍 Your Location</label>
                            <div className="location-actions">
                                <button
                                    type="button"
                                    className="location-button"
                                    onClick={handleGetLocation}
                                    disabled={gettingLocation}
                                >
                                    {gettingLocation ? (
                                        <>
                                            <span className="spinner-small"></span>
                                            Getting...
                                        </>
                                    ) : (
                                        <>
                                            <span>🎯</span>
                                            Use GPS
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="toggle-manual-btn"
                                    onClick={() => setShowManualInput(!showManualInput)}
                                    title={showManualInput ? 'Switch to search' : 'Switch to manual coordinates'}
                                >
                                    {showManualInput ? '🔍 Search' : '⚙️ Manual'}
                                </button>
                            </div>
                        </div>

                        {locationError && (
                            <div className="location-error">
                                ⚠️ {locationError}
                            </div>
                        )}

                        {!showManualInput ? (
                            <>
                                <LocationSearch onLocationSelect={handleLocationSelect} />
                                {selectedLocationName && (
                                    <div className="selected-location">
                                        <span className="selected-icon">✓</span>
                                        <span className="selected-text">{selectedLocationName}</span>
                                        <span className="selected-coords">
                                            ({formData.source.lat.toFixed(4)}, {formData.source.lng.toFixed(4)})
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="location-inputs">
                                <div className="location-input-group">
                                    <label htmlFor="lat" className="small-label">Latitude</label>
                                    <input
                                        type="number"
                                        id="lat"
                                        name="lat"
                                        value={formData.source.lat}
                                        onChange={handleChange}
                                        className="form-control"
                                        step="0.0001"
                                        required
                                    />
                                </div>

                                <div className="location-input-group">
                                    <label htmlFor="lng" className="small-label">Longitude</label>
                                    <input
                                        type="number"
                                        id="lng"
                                        name="lng"
                                        value={formData.source.lng}
                                        onChange={handleChange}
                                        className="form-control"
                                        step="0.0001"
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={loading || (formData.crop === 'other' && !customCrop.trim())}
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            Optimizing...
                        </>
                    ) : (
                        <>
                            <span className="button-icon">🎯</span>
                            Find Best Mandi
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default InputForm;
