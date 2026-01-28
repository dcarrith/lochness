'use client';

import React, { useState } from 'react';

const Calculator: React.FC = () => {
    const [plots, setPlots] = useState<number>(100);
    const [networkSize, setNetworkSize] = useState<number>(40);
    const [result, setResult] = useState<{ daily: string; monthly: string; size: string } | null>(null);

    const calculateRewards = () => {
        // Simple Chia reward calculation (approximate)
        const plotSizeInTiB = plots * 0.1; // Each plot is roughly 0.1 TiB
        const networkSizeInTiB = networkSize * 1024 * 1024; // Convert EiB to TiB
        const dailyRewards = (plotSizeInTiB / networkSizeInTiB) * 4608 * 2; // 4608 blocks per day, 2 XCH per block

        setResult({
            daily: dailyRewards.toFixed(4),
            monthly: (dailyRewards * 30).toFixed(4),
            size: plotSizeInTiB.toFixed(2)
        });
    };

    return (
        <div className="calculator-widget" style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '15px' }}>Chia Farming Calculator</h4>
            <div className="calculator-form">
                <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label htmlFor="plotSize" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Number of Plots (k32):</label>
                    <input
                        type="number"
                        id="plotSize"
                        min="1"
                        value={plots}
                        onChange={(e) => setPlots(Number(e.target.value))}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="networkSize" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Network Space (EiB):</label>
                    <input
                        type="number"
                        id="networkSize"
                        min="0.1"
                        step="0.1"
                        value={networkSize}
                        onChange={(e) => setNetworkSize(Number(e.target.value))}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <button
                    onClick={calculateRewards}
                    className="btn btn-primary"
                    style={{ width: '100%', marginBottom: '15px' }}
                >
                    Calculate ROI
                </button>

                {result && (
                    <div id="calculationResult" style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', border: '1px solid #eee' }}>
                        <p style={{ margin: '0 0 10px 0' }}>With {plots} plots ({result.size} TiB) on a {networkSize} EiB network:</p>
                        <p style={{ margin: '0 0 5px 0' }}>Estimated daily XCH: <strong>{result.daily} XCH</strong></p>
                        <p style={{ margin: '0' }}>Estimated monthly XCH: <strong>{result.monthly} XCH</strong></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calculator;
