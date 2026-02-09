import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import './ProfitChart.css';

const ProfitChart = ({ results, bestMandiName }) => {
    if (!results || results.length === 0) return null;

    // Prepare data for chart
    const chartData = results.map(result => ({
        name: result.mandi.length > 15 ? result.mandi.substring(0, 15) + '...' : result.mandi,
        fullName: result.mandi,
        'Net Profit': result.netProfit,
        'Revenue': result.revenue,
        'Total Cost': result.totalCost,
    }));

    // Sort by profit descending
    chartData.sort((a, b) => b['Net Profit'] - a['Net Profit']);

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-title">{payload[0].payload.fullName}</p>
                    <p className="tooltip-item revenue">
                        <span className="tooltip-label">Revenue:</span>
                        <span className="tooltip-value">₹{payload[0].payload['Revenue'].toLocaleString()}</span>
                    </p>
                    <p className="tooltip-item cost">
                        <span className="tooltip-label">Total Cost:</span>
                        <span className="tooltip-value">₹{payload[0].payload['Total Cost'].toLocaleString()}</span>
                    </p>
                    <p className="tooltip-item profit">
                        <span className="tooltip-label">Net Profit:</span>
                        <span className="tooltip-value">₹{payload[0].payload['Net Profit'].toLocaleString()}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="chart-container">
            <h3 className="chart-title">📈 Profit Comparison Chart</h3>
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            style={{ fontSize: '0.85rem', fontFamily: 'Inter' }}
                        />
                        <YAxis
                            style={{ fontSize: '0.85rem', fontFamily: 'Inter' }}
                            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px', fontFamily: 'Inter' }}
                        />
                        <Bar dataKey="Net Profit" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.fullName === bestMandiName ? '#ffd700' : '#667eea'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                <div className="chart-insights">
                    <div className="insight-card">
                        <div className="insight-icon">💰</div>
                        <div className="insight-content">
                            <div className="insight-label">Highest Profit</div>
                            <div className="insight-value">₹{Math.max(...chartData.map(d => d['Net Profit'])).toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="insight-card">
                        <div className="insight-icon">📊</div>
                        <div className="insight-content">
                            <div className="insight-label">Profit Range</div>
                            <div className="insight-value">
                                ₹{(Math.max(...chartData.map(d => d['Net Profit'])) - Math.min(...chartData.map(d => d['Net Profit']))).toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <div className="insight-card">
                        <div className="insight-icon">🎯</div>
                        <div className="insight-content">
                            <div className="insight-label">Average Profit</div>
                            <div className="insight-value">
                                ₹{Math.round(chartData.reduce((sum, d) => sum + d['Net Profit'], 0) / chartData.length).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfitChart;
