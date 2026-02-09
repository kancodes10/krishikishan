import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import MapView from './components/MapView';
import ProfitChart from './components/ProfitChart';
import { optimizeTrip } from './services/api';
import './App.css';

function App() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [queryData, setQueryData] = useState(null);

    const handleOptimize = async (formData) => {
        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await optimizeTrip(formData);

            if (response.success) {
                setResults(response.data);
                setQueryData(formData);
                // Smooth scroll to results
                setTimeout(() => {
                    document.getElementById('results-section')?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }, 100);
            } else {
                setError(response.message || 'Optimization failed');
            }
        } catch (err) {
            setError(err.message || 'Failed to connect to server. Please ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-bg"></div>
                <div className="container">
                    <InputForm onSubmit={handleOptimize} loading={loading} />

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            <div>
                                <strong>Error:</strong> {error}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Section */}
            {results && (
                <div id="results-section" className="results-section">
                    <div className="container">
                        <ResultsDisplay data={results} />

                        <ProfitChart
                            results={results.results}
                            bestMandiName={results.optimization.bestMandi.name}
                        />

                        <MapView
                            sourceLocation={queryData.source}
                            results={results.results}
                            bestMandiName={results.optimization.bestMandi.name}
                        />
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>🌾 Krishi-Route</h3>
                            <p>Empowering farmers with data-driven logistics decisions</p>
                        </div>
                        <div className="footer-section">
                            <h4>Features</h4>
                            <ul>
                                <li>Real-time mandi prices</li>
                                <li>Profit optimization</li>
                                <li>Route planning</li>
                                <li>Cost analysis</li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>About</h4>
                            <p>Built with modern tech stack for Indian agricultural sector</p>
                            <p className="tech-stack">React • Node.js • MongoDB • Leaflet</p>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 Krishi-Route. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
