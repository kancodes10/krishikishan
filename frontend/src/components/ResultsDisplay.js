import React from 'react';
import './ResultsDisplay.css';

const ResultsDisplay = ({ data }) => {
    if (!data || !data.optimization) return null;

    const { optimization, results, metadata } = data;
    const { bestMandi, localMandi, extraProfit, recommendation, worthExtraDistance, perishability } = optimization;

    // Sort by distance and take only top 5 nearest
    const sortedByDistance = [...results].sort((a, b) => a.distance - b.distance);
    const nearestMandis = sortedByDistance.slice(0, 5);
    const totalMandis = results.length;

    return (
        <div className="results-container">
            <div className="results-header">
                <h2>🎯 Optimization Results</h2>
                <p className="results-subtitle">
                    Showing 5 nearest mandis • Analyzed {totalMandis} mandis within {metadata.maxDistanceKm} km
                </p>
            </div>

            {/* Perishability Alert */}
            {perishability?.bestMandi?.warning?.hasWarning && (
                <div className={`perishability-alert perishability-${perishability.bestMandi.warning.severity}`}>
                    <div className="alert-header">
                        <span className="alert-icon">{perishability.bestMandi.warning.icon}</span>
                        <span className="alert-title">Crop Perishability Warning</span>
                    </div>
                    <p className="alert-message">{perishability.bestMandi.warning.message}</p>
                    <p className="alert-recommendation">{perishability.bestMandi.warning.recommendation}</p>

                    {perishability.bestMandi.spoilagePercentage > 0 && (
                        <div className="spoilage-details">
                            <div className="spoilage-stat">
                                <span className="spoilage-label">Expected Spoilage:</span>
                                <span className="spoilage-value">{perishability.bestMandi.spoilagePercentage}%</span>
                            </div>
                            <div className="spoilage-stat">
                                <span className="spoilage-label">Potential Loss:</span>
                                <span className="spoilage-value">₹{perishability.bestMandi.spoilageAmount?.toLocaleString()}</span>
                            </div>
                            {perishability.bestMandi.adjustedProfit !== undefined && (
                                <div className="spoilage-stat">
                                    <span className="spoilage-label">Adjusted Profit:</span>
                                    <span className="spoilage-value adjusted">₹{perishability.bestMandi.adjustedProfit.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {perishability.shouldConsiderLocal && perishability.localMandi && (
                        <div className="local-alternative">
                            <strong>💡 Consider Local Option:</strong> {localMandi.name} at {localMandi.distance}km
                            has {perishability.localMandi.warning.severity} spoilage risk
                        </div>
                    )}
                </div>
            )}

            {/* Winner Card */}
            <div className="winner-card">
                <div className="winner-badge">
                    <span className="trophy">🏆</span>
                    <span>Best Choice</span>
                </div>
                <h3 className="winner-name">{bestMandi.name}</h3>
                <div className="winner-stats">
                    <div className="stat-item">
                        <div className="stat-value">₹{bestMandi.netProfit.toLocaleString()}</div>
                        <div className="stat-label">Net Profit</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-value">{bestMandi.distance} km</div>
                        <div className="stat-label">Distance</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-value">₹{bestMandi.price}/Q</div>
                        <div className="stat-label">Price</div>
                    </div>
                </div>

                {extraProfit > 0 && localMandi && (
                    <div className="extra-profit-badge">
                        <span className="badge-icon">💰</span>
                        Earn ₹{extraProfit.toLocaleString()} more than local mandi ({localMandi.name})
                    </div>
                )}
            </div>

            {/* Recommendation */}
            <div className="recommendation-card">
                <div className="recommendation-icon">💡</div>
                <p className="recommendation-text">{recommendation}</p>
                {worthExtraDistance && worthExtraDistance.worth !== undefined && !worthExtraDistance.worth && (
                    <p className="recommendation-note">
                        ⚠️ {worthExtraDistance.reason}
                    </p>
                )}
            </div>

            {/* 5 Nearest Mandis */}
            <div className="all-results-section">
                <h3 className="section-title">
                    📍 5 Nearest Mandis
                    <span className="mandi-count">Sorted by distance</span>
                </h3>
                <div className="results-grid">
                    {nearestMandis.map((result, index) => (
                        <div
                            key={index}
                            className={`result-card ${result.mandi === bestMandi.name ? 'best' : ''}`}
                        >
                            {result.mandi === bestMandi.name && (
                                <div className="best-tag">⭐ Best Profit</div>
                            )}
                            {localMandi && result.mandi === localMandi.name && result.mandi !== bestMandi.name && (
                                <div className="local-tag">📍 Nearest</div>
                            )}
                            {index === 0 && result.mandi !== bestMandi.name && (
                                <div className="distance-tag">🎯 Closest</div>
                            )}

                            <h4 className="result-mandi-name">{result.mandi}</h4>

                            <div className="result-details">
                                <div className="detail-row">
                                    <span className="detail-label">Distance:</span>
                                    <span className="detail-value">{result.distance} km</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Price:</span>
                                    <span className="detail-value">₹{result.price}/Q</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Revenue:</span>
                                    <span className="detail-value green">₹{result.revenue.toLocaleString()}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Transport Cost:</span>
                                    <span className="detail-value red">₹{result.transportCost.toLocaleString()}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Handling Cost:</span>
                                    <span className="detail-value red">₹{result.handlingCost.toLocaleString()}</span>
                                </div>
                                <div className="detail-row total">
                                    <span className="detail-label">Total Cost:</span>
                                    <span className="detail-value red">₹{result.totalCost.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="result-profit">
                                <div className="profit-amount">₹{result.netProfit.toLocaleString()}</div>
                                <div className="profit-label">Net Profit</div>
                                <div className="profit-percentage">{result.profitPercentage}% margin</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResultsDisplay;
