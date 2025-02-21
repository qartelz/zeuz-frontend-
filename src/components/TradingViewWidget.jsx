// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TradingViewWidget = () => {
//     const [chartData, setChartData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const authDataString = localStorage.getItem("authData");
//     const authData = authDataString ? JSON.parse(authDataString) : null;
//     const broadcast_token= authData?.broadcast_token;

//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             setError(null);

//             const url = 'https://orca-uatapi.enrichmoney.in/ert-analytics-api/v1/charts/historical';
//             const userId = 'KE0070'; 
//             const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIiwiaWF0IjoxNzM0MjUwOTY2LCJleHAiOjE3MzQzMDkwMDAsInN1YmplY3RfaWQiOiJLRTAwNzAiLCJwYXJ0bmVyX2NoYW5uZWwiOiJBUEkiLCJwYXJ0bmVyX2NvZGUiOiJLRTAwNzAiLCJ1c2VyX2lkIjoiS0UwMDcwIiwibGFzdF92YWxpZGF0ZWRfZGF0ZV90aW1lIjoxNzM0MjUwOTY2NDMzLCJpc3N1ZXJfaWQiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIn0.ofBhYQO0tCfkhN3yfW7kNHLp9EMHkSZarFVRXpGkLvw"
//             const payload = {
//                 start_time: '2024-11-19T03:45:00.000Z',
//                 end_time: '2024-11-19T09:15:00.000Z',
//                 interval: '1minute',
//                 ticker: 'TCS.NSE',
//                 source: 'nse',
//             };

//             try {
//                 const response = await axios.post(url, payload, {
//                     headers: {
//                         'user-id': userId,
//                         Authorization: jwtToken,
//                         'Content-Type': 'application/json',
//                     },
//                 });

//                 setChartData(response.data,"chart daata is being loaded from here this is the reuired data for your chart"); // Adjust according to your API response structure
//             } catch (err) {
//                 setError('Failed to fetch chart data. Please try again.');
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     return (
//         <div className="trading-view-widget">
//             {loading && <p>Loading chart data...</p>}
//             {error && <p>{error}</p>}
//             {!loading && !error && (
//                 <div>
//                     {/* Display your chart data here */}
//                     <h3>Chart Data</h3>
//                     <pre>{JSON.stringify(chartData, null, 2)}</pre>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TradingViewWidget;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import { useWebSocket } from '../utils/WebSocketContext';

const TradingViewWidget = ({ selectedData }) => {

    const { tokenPrices, isConnected, broadcastToken, lastMessage } = useWebSocket();
    const formattedMessage = lastMessage ? JSON.stringify(JSON.parse(lastMessage), null, 2) : "No message received yet.";


    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const chartContainerRef = useRef(null);

    const authDataString = localStorage.getItem('authData');
    const authData = authDataString ? JSON.parse(authDataString) : null;
    const broadcast_token = authData?.broadcast_token;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const url = 'https://orca-uatapi.enrichmoney.in/ert-analytics-api/v1/charts/historical';
            const userId = 'KE0070';
            const jwtToken = `${broadcast_token}`;

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

                // Transform the data to match the lightweight-charts format
                const formattedData = response.data.map((item) => ({
                    time: new Date(item.time).getTime() / 1000, // Convert ISO to UNIX timestamp
                    open: item.open,
                    high: item.high,
                    low: item.low,
                    close: item.close,
                }));

                setChartData(formattedData);
            } catch (err) {
                setError('Failed to fetch chart data. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [broadcast_token]);

    useEffect(() => {
        if (chartData.length && chartContainerRef.current) {
            const chart = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: 400,
                layout: {
                    backgroundColor: '#ffffff',
                    textColor: '#000',
                },
                grid: {
                    vertLines: { color: '#e1e1e1' },
                    horzLines: { color: '#e1e1e1' },
                },
                priceScale: {
                    borderColor: '#cccccc',
                },
                timeScale: {
                    borderColor: '#cccccc',
                },
            });

            const candlestickSeries = chart.addCandlestickSeries();
            candlestickSeries.setData(chartData);

            const handleResize = () => {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
            };

            window.addEventListener('resize', handleResize);

            return () => {
                chart.remove();
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [chartData]);

    return (
        <div className="trading-view-widget">
            {/* {loading && <p>Loading chart data...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && <div ref={chartContainerRef} style={{ width: '100%', height: '400px' }} />} */}

<h2>WebSocket Connection Status</h2>
      <p><strong>Connection Status:</strong> {isConnected ? 'Connected' : 'Disconnected'}</p>
      {/* <p><strong>Broadcast Token:</strong> {broadcastToken || 'N/A'}</p> */}
      <h3>Current Token Prices:</h3>
      <pre>{JSON.stringify(tokenPrices, null, 2) || 'No token prices available'}</pre>
      <h3>Last Message Received:</h3>
      <pre>{formattedMessage ? formattedMessage : "No message received yet."}</pre>

            
        </div>
    );
};

export default TradingViewWidget;
