import React, { useState, useEffect } from 'react';

const OptionsChain = () => {
  const [currentPrice] = useState(23532.70);
  
  // Sample data generation
  const generateOptionsData = (currentPrice) => {
    const strikes = [];
    const nearestStrike = Math.round(currentPrice / 50) * 50; // Round to nearest 50
    for (let i = -3; i <= 3; i++) {
      const strike = nearestStrike + (i * 50);
      strikes.push({
        strike,
        isCurrentPrice: i === 0,
        call: {
          vega: (11 + Math.random()).toFixed(3),
          theta: (-8 - Math.random()).toFixed(3),
          gamma: 0.001,
          delta: (0.7 - Math.abs(i) * 0.1).toFixed(3),
          impVol: (10.5 + Math.random()).toFixed(2),
          volume: Math.round(Math.random() * 20000),
          oi: Math.round(Math.random() * 30),
          price: Math.round(Math.random() * 200 + 100)
        },
        put: {
          vega: (11 + Math.random()).toFixed(3),
          theta: (-9 - Math.random()).toFixed(3),
          gamma: 0.001,
          delta: (-0.3 - Math.abs(i) * 0.1).toFixed(3),
          impVol: (11 + Math.random()).toFixed(2),
          volume: Math.round(Math.random() * 20000),
          oi: Math.round(Math.random() * 30),
          price: Math.round(Math.random() * 150 + 50)
        }
      });
    }
    return strikes.sort((a, b) => a.strike - b.strike);
  };

  const [optionsData, setOptionsData] = useState(generateOptionsData(currentPrice));

  // Update data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setOptionsData(generateOptionsData(currentPrice));
    }, 5000);
    return () => clearInterval(interval);
  }, [currentPrice]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Options Chain</h2>
        <span className="font-medium">Current Price: ₹{currentPrice.toFixed(2)}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th colSpan={8} className="text-center bg-blue-50 p-2">CALLS</th>
              <th className="text-center bg-gray-50 p-2">Strike</th>
              <th colSpan={8} className="text-center bg-blue-50 p-2">PUTS</th>
            </tr>
            <tr className="text-xs border-b">
              <th className="p-2">Vega</th>
              <th className="p-2">Theta</th>
              <th className="p-2">Gamma</th>
              <th className="p-2">Delta</th>
              <th className="p-2">Imp Vol</th>
              <th className="p-2">Volume</th>
              <th className="p-2">OI</th>
              <th className="p-2">Price</th>
              <th className="p-2 ">Strike</th>
              <th className="p-2">Price</th>
              <th className="p-2">OI</th>
              <th className="p-2">Volume</th>
              <th className="p-2">Imp Vol</th>
              <th className="p-2">Delta</th>
              <th className="p-2">Gamma</th>
              <th className="p-2">Theta</th>
              <th className="p-2">Vega</th>
            </tr>
          </thead>
          <tbody>
            {optionsData.map((row, index) => {
              const isLowerStrike = row.strike < currentPrice;
              const isCurrentPriceRow = row.isCurrentPrice;
              
              return (
                <tr 
                  key={row.strike} 
                  className={`border-b text-right ${isCurrentPriceRow ? 'relative' : ''}`}
                >
                  {/* Calls section */}
                  <td className={`p-2 ${isCurrentPriceRow ? 'bg-blue-100' : isLowerStrike ? 'bg-red-100' : 'bg-white'}`}>{row.call.vega}</td>
                  <td className={`p-2 ${isCurrentPriceRow ? 'bg-blue-100' : isLowerStrike ? 'bg-red-100' : 'bg-white'}`}>{row.call.theta}</td>
                  <td className={`p-2 ${isCurrentPriceRow ? 'bg-blue-100' : isLowerStrike ? 'bg-red-100' : 'bg-white'}`}>{row.call.gamma}</td>
                  <td className={`p-2 ${isCurrentPriceRow ? 'bg-blue-100' : isLowerStrike ? 'bg-red-100' : 'bg-white'}`}>{row.call.delta}</td>
                  <td className={`p-2 ${isCurrentPriceRow ? 'bg-blue-100' : isLowerStrike ? 'bg-red-100' : 'bg-white'}`}>{row.call.impVol}%</td>
                  <td className={`p-2 ${isCurrentPriceRow ? 'bg-blue-100' : isLowerStrike ? 'bg-red-100' : 'bg-white'}`}>{row.call.volume.toLocaleString()}</td>
                  <td className={`p-2 ${isCurrentPriceRow ? 'bg-blue-100' : isLowerStrike ? 'bg-red-100' : 'bg-white'}`}>{row.call.oi}</td>
                  <td className={`p-2 ${isCurrentPriceRow ? 'bg-blue-100' : isLowerStrike ? 'bg-red-100' : 'bg-white'}`}>{row.call.price.toFixed(2)}</td>
                  
                  {/* Strike Price */}
                  <td className={`p-2 text-center font-medium ${isCurrentPriceRow ? 'bg-yellow-100 font-bold' : 'bg-gray-50'}`}>
                    {isCurrentPriceRow && (
                      <div className="absolute left-0 right-0 top-0 h-full flex items-center justify-center">
                        <div className="h-full w-1 bg-yellow-400 absolute left-0"></div>
                        <div className="h-full w-1 bg-yellow-400 absolute right-0"></div>
                      </div>
                    )}
                    {row.strike.toFixed(2)}
                  </td>
                  
                  {/* Puts section */}
                  <td className={`p-2 ${isCurrentPriceRow ? 'bg-blue-100' : isLowerStrike ? 'bg-white' : 'bg-red-100'}`}>{row.put.price.toFixed(2)}</td>
                  <td className={`p-2 ${isCurrentPriceRow ? 'bg-blue-100' : isLowerStrike ? 'bg-white' : 'bg-red-100'}`}>{row.put.oi}</td>
                  <td className={`p-2 ${isCurrentPriceRow ? 'bg-blue-100' : isLowerStrike ? 'bg-white' : 'bg-red-100'}`}>{row.put.volume.toLocaleString()}</td>
                  <td className={`p-2 ${isCurrentPriceRow ? 'bg-blue-100' : isLowerStrike ? 'bg-white' : 'bg-red-100'}`}>{row.put.impVol}%</td>
                  <td className={`p-2 ${isCurrentPriceRow ? 'bg-blue-100' : isLowerStrike ? 'bg-white' : 'bg-red-100'}`}>{row.put.delta}</td>
                  <td className={`p-2 ${isCurrentPriceRow ? 'bg-blue-100' : isLowerStrike ? 'bg-white' : 'bg-red-100'}`}>{row.put.gamma}</td>
                  <td className={`p-2 ${isCurrentPriceRow ? 'bg-blue-100' : isLowerStrike ? 'bg-white' : 'bg-red-100'}`}>{row.put.theta}</td>
                  <td className={`p-2 ${isCurrentPriceRow ? 'bg-blue-100' : isLowerStrike ? 'bg-white' : 'bg-red-100'}`}>{row.put.vega}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OptionsChain;