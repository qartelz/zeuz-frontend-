import React, { useEffect, useRef, useState } from "react";

const ClosedOrders = ({ trades }) => {
  const [visibleTrades, setVisibleTrades] = useState(100);
  const containerRef = useRef(null);

  const closedTrades = trades.filter(
    (trade) => trade.trade_status === "completed"
  );
  console.log(closedTrades,"the closed  trades")

  // Calculate total investment, current value, total P&L, and average P&L
  const totalInvestment = closedTrades.reduce(
    (sum, trade) => sum + trade.avg_price * trade.quantity,
    0
  );


 

  const calculateProfit = (trade) => {
    const profit = (trade.exit_price - trade.avg_price) * trade.quantity;
    return profit;
  };

  

  const handleScroll = () => {
    if (
      containerRef.current &&
      containerRef.current.scrollTop + containerRef.current.clientHeight >=
        containerRef.current.scrollHeight
    ) {
      setVisibleTrades((prev) => prev + 10); // Load 10 more trades
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-8 p-0 md:p-4">
     
      {closedTrades.length > 0 ? (

        
        <div className="overflow-x-auto">

<div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex flex-col text-center">
            <span className="text-sm font-bold text-gray-500">
             Total Closed Positions
            </span>
            <span className="text-lg font-semibold text-gray-800">
              {closedTrades.length}
             
            </span>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-sm font-bold text-gray-500">
              Total Investment
            </span>
            <span className="text-lg font-semibold text-gray-800">
              ₹{totalInvestment.toFixed(2)}
            </span>
          </div>
        
          <div className="flex flex-col text-center">
            <span className="text-sm font-bold text-gray-500">Total P&L</span>
            <span
              // className={`text-lg font-semibold ${
              //   totalPnL > 0
              //     ? "text-green-600"
              //     : totalPnL < 0
              //     ? "text-red-600"
              //     : "text-gray-500"
              // }`}
            >
              {/* ₹{totalPnL.toFixed(2)} */}
            </span>
          </div>
        </div>
      </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-6 text-center gap-4 text-sm bg-gray-100 px-4 py-2 font-semibold text-gray-800">
              <div>Stock Name</div>
              <div>Trade Type</div>
              <div>Entry Price</div>
              <div>Closing Price</div>
              <div>Profit / Loss</div>
              <div>Executed On</div>
            </div>
          </div>

          {/* Scrollable Mapped Trades Data */}
          <div
            ref={containerRef}
            className="max-h-96 overflow-y-auto border text-center border-gray-300 rounded-lg"
          >
            {closedTrades.slice(0, visibleTrades).map((trade, index) => {
              const profit = calculateProfit(trade); // Assuming you have a profit calculation logic

              return (
                <div
                  key={trade.id || index}
                  className="grid grid-cols-6   items-center bg-white px-4 py-2 border-b border-gray-200"
                >
                  <div className="text-xs md:text-lg font-semibold text-gray-800">
                    {trade.display_name || "N/A"}
                  </div>
                  <div className="text-xs md:text-lg text-gray-800">
                    {trade.trade_type || "N/A"}
                  </div>
                  <div className="text-xs md:text-lg text-gray-800">
                    {trade.avg_price.toFixed(2)}
                  </div>
                  <div className="text-xs md:text-lg text-gray-800">
                    {trade.quantity}
                  </div>
                  <div
                    className={`text-xs md:text-lg  font-semibold ${
                      profit > 0
                        ? "text-green-600"
                        : profit < 0
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {profit.toFixed(2)}
                  </div>
                  <div className="text-xs  md:text-lg font-medium text-gray-800">
                  {new Date(trade.updated_at).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No Closed Trades available.</p>
      )}
    </div>
  );
};

export default ClosedOrders;
