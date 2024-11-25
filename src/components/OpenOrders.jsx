// OpenOrders.js
import React, { useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import BuySellSub from "./BuySellSub";
import { WebSocketTrade, useWebSocketTrade } from "./WebSocketTrade";

const OpenOrders = ({ trades, maxTrades }) => {
  const openTrades = trades.filter(
    (trade) => trade.trade_status === "incomplete"
  );
  const { lastPrice } = useWebSocketTrade(); // Access live prices
  const [expandedTradeIndex, setExpandedTradeIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);

  console.log(selectedTrade, "yolllyoyo");

  const toggleExpand = (index) => {
    setExpandedTradeIndex(index === expandedTradeIndex ? null : index);
  };

  const displayedTrades = maxTrades ? trades.slice(0, maxTrades) : trades;

  const handleOpenModal = (trade) => {
    setSelectedTrade(trade);
    setModalOpen(true);
  };

  const calculatePL = (trade) => {
    const tradePrice = parseFloat(trade.avg_price);
    const quantity = parseFloat(trade.quantity);
    const currentPrice = lastPrice; // Ensure numeric
    if (trade.trade_type === "Buy") {
      return ((currentPrice - tradePrice) * quantity).toFixed(2);
    } else if (trade.trade_type === "Sell") {
      return ((tradePrice - currentPrice) * quantity).toFixed(2);
    }
    return "0.00";
  };

  return (
    <>
      <div className="max-w-5xl mx-auto mt-8 p-4">
        {openTrades.length > 0 && displayedTrades.length > 0 ? (
          displayedTrades.map((trade, index) => (
            <div
              key={trade.id || index}
              className="bg-white rounded-lg mb-4 shadow transition-all duration-300"
            >
              <div
                onClick={() => toggleExpand(index)}
                className="flex flex-col  lg:flex-row items-start lg:items-center justify-between p-4 cursor-pointer"
              >
                <div className="flex-1">
                  <div className="text-lg font-semibold text-gray-700">
                    {trade.display_name || "N/A"}
                  </div>

                  <div className="text-left flex justify-start md:justify-normal items-center md:items-start md:flex-col">
                    <div
                      className={`text-lg font-semibold flex items-center ${
                        parseFloat(calculatePL(trade)) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {Math.abs(calculatePL(trade))}
                      <span className="ml-1">
                        {parseFloat(calculatePL(trade)) >= 0 ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {parseFloat(calculatePL(trade)) >= 0 ? "Profit" : "Loss"}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-1  items-center">
                  <div className="flex space-x-4  md:grid grid-cols-4 mt-4 md:mt-0 w-full">
                    {/* Column 1 */}
                    <div className="flex flex-col  ">
                      <div className="text-sm font-medium text-gray-500">
                        Trade Type
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        {trade.trade_type}
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col ">
                      <div className="text-sm font-medium text-gray-500">
                        Avg. Price
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        <span>{trade.avg_price.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-500">
                        Quantity
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        {trade.quantity}
                      </div>
                    </div>

                    {/* Column 4 */}
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-500">
                        Invested
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        {trade.invested_coin.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <EllipsisVerticalIcon className="hidden ml-4 lg:block h-6 w-6 text-gray-500" />
              </div>
              <div
                className={`overflow-hidden ${
                  expandedTradeIndex === index ? "max-h-96" : "max-h-0"
                } transition-max-height duration-300`}
              >
                <div className="p-4 bg-gray-100">
                  <p className="text-gray-800 mt-2">
                    <strong>Created On:</strong>{" "}
                    {new Date(trade.created_at).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleOpenModal(trade)}
                    className={`mt-4 px-4 py-2 rounded-md ${
                      trade.trade_type === "Buy"
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {trade.trade_type === "Buy" ? "Sell" : "Buy"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No Open Positions available.
          </p>
        )}

        {modalOpen && selectedTrade && (
          <WebSocketTrade selectedTrade={selectedTrade}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-md shadow-lg">
                <BuySellSub
                  selectedTrade={selectedTrade}
                  selectedData={selectedTrade}
                  onClose={() => setModalOpen(false)}
                  initialIsBuy={selectedTrade.trade_type === "Buy"}
                />
              </div>
            </div>
          </WebSocketTrade>
        )}
      </div>
    </>
  );
};

export default OpenOrders;
