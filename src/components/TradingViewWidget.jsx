import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TradingViewWidget = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const authDataString = localStorage.getItem("authData");
    const authData = authDataString ? JSON.parse(authDataString) : null;
    const broadcast_token= authData?.broadcast_token;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const url = 'https://orca-uatapi.enrichmoney.in/ert-analytics-api/v1/charts/historical';
            const userId = 'KE0070'; 
            const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIiwiaWF0IjoxNzM0MjUwOTY2LCJleHAiOjE3MzQzMDkwMDAsInN1YmplY3RfaWQiOiJLRTAwNzAiLCJwYXJ0bmVyX2NoYW5uZWwiOiJBUEkiLCJwYXJ0bmVyX2NvZGUiOiJLRTAwNzAiLCJ1c2VyX2lkIjoiS0UwMDcwIiwibGFzdF92YWxpZGF0ZWRfZGF0ZV90aW1lIjoxNzM0MjUwOTY2NDMzLCJpc3N1ZXJfaWQiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIn0.ofBhYQO0tCfkhN3yfW7kNHLp9EMHkSZarFVRXpGkLvw"
            const payload = {
                start_time: '2024-11-19T03:45:00.000Z',
                end_time: '2024-11-19T09:15:00.000Z',
                interval: '1minute',
                ticker: 'TCS.NSE',
                source: 'nse',
            };

            try {
                const response = await axios.post(url, payload, {
                    headers: {
                        'user-id': userId,
                        Authorization: jwtToken,
                        'Content-Type': 'application/json',
                    },
                });

                setChartData(response.data); // Adjust according to your API response structure
            } catch (err) {
                setError('Failed to fetch chart data. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="trading-view-widget">
            {loading && <p>Loading chart data...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
                <div>
                    {/* Display your chart data here */}
                    <h3>Chart Data</h3>
                    <pre>{JSON.stringify(chartData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default TradingViewWidget;
