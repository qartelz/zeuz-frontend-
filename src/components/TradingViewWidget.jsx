import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const TradingViewWidget = ({ data }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      // Initialize the chart
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.offsetWidth,
        height: 400,
        layout: {
          backgroundColor: '#FFFFFF',
          textColor: '#000',
        },
        grid: {
          vertLines: { color: '#F0F0F0' },
          horzLines: { color: '#F0F0F0' },
        },
        crosshair: {
          mode: 1, // Normal crosshair mode
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      // Add candlestick series
      seriesRef.current = chartRef.current.addCandlestickSeries();

      // Update the chart with data
      seriesRef.current.setData(
        data.map((item) => ({
          time: new Date(item.time).getTime() / 1000, // Convert ISO to Unix timestamp
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }))
      );
    }

    // Cleanup on component unmount
    return () => chartRef.current?.remove();
  }, [data]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '400px' }} />;
};

export default TradingViewWidget;
