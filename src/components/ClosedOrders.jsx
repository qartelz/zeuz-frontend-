import React from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const ClosedOrders = ({ trades }) => {
  const closedTrades = trades.filter(
    (trade) => trade.trade_status === "completed"
  );

  // Calculate total investment, current value, total P&L, and average P&L
  const totalInvestment = closedTrades.reduce(
    (sum, trade) => sum + trade.avg_price * trade.quantity,
    0
  );

  const currentValue = closedTrades.reduce(
    (sum, trade) => sum + trade.exit_price * trade.quantity,
    0
  );

  const totalPnL = currentValue - totalInvestment;
  const averagePnL = closedTrades.length > 0 ? totalPnL / closedTrades.length : 0;

  const calculateProfit = (trade) => {
    const profit = (trade.exit_price - trade.avg_price) * trade.quantity;
    return profit;
  };

  const getProfitStatus = (profit) => {
    return profit > 0 ? "Profit" : profit < 0 ? "Loss" : "Break-even";
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4">
      {/* Info Bar */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex flex-col text-center">
            <span className="text-sm font-medium text-gray-500">Total Trades</span>
            <span className="text-lg font-semibold text-gray-800">
              {closedTrades.length}
            </span>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-sm font-medium text-gray-500">Total Investment</span>
            <span className="text-lg font-semibold text-gray-800">
              ₹{totalInvestment.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-sm font-medium text-gray-500">Current Value</span>
            <span className="text-lg font-semibold text-gray-800">
              ₹{currentValue.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-sm font-medium text-gray-500">Total P&L</span>
            <span
              className={`text-lg font-semibold ${
                totalPnL > 0
                  ? "text-green-600"
                  : totalPnL < 0
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              ₹{totalPnL.toFixed(2)}
            </span>
          </div>
          
        </div>
      </div>

      {/* Closed Trades List */}
      {closedTrades.length > 0 ? (
        closedTrades.map((trade, index) => {
          const profit = calculateProfit(trade);
          const profitStatus = getProfitStatus(profit);

          return (
            <div
              key={trade.id || index}
              className="bg-white rounded-lg mb-2 shadow-md transition-all duration-300 hover:shadow-lg border border-gray-200"
            >
              {/* Top Section with Time and Type */}
              <div className="flex items-center justify-between px-3 py-2">
                <div className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                  {trade.execution_time || "N/A"} • {trade.type || "N/A"}
                </div>
                <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
              </div>

              {/* Main Content */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-3 py-2 cursor-pointer">
                <div className="flex-1">
                  <div className="text-base font-semibold text-gray-800">
                    {trade.display_name || "N/A"}
                  </div>
                  <div className="text-xs text-green-400 mt-1">Success</div>
                </div>

                <div className="flex flex-1 items-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full mt-2 md:mt-0">
                    <div className="flex flex-col">
                      <div className="text-xs font-medium text-gray-500">
                        Trade Type
                      </div>
                      <div className="text-base font-semibold text-gray-800">
                        {trade.trade_type}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="text-xs font-medium text-gray-500">
                        Avg. Price
                      </div>
                      <div className="text-base font-semibold text-gray-800">
                        <span>{trade.avg_price.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="text-xs font-medium text-gray-500">
                        Quantity
                      </div>
                      <div className="text-base font-semibold text-gray-800">
                        {trade.quantity}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="text-xs font-medium text-gray-500">
                        Profit / Loss
                      </div>
                      <div
                        className={`text-base font-semibold ${
                          profit > 0
                            ? "text-green-600"
                            : profit < 0
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {profit.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No Closed Trades available.</p>
      )}
    </div>
  );
};

export default ClosedOrders;
