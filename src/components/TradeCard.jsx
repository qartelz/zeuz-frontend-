import React, { useState, useEffect } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const TradeCard = ({ trade, onPnLChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastPrice, setLastPrice] = useState(null);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  const handleOpenModal = (trade) => {
    // Logic to handle opening the modal
    console.log("Open modal for trade:", trade);
  };
  

  useEffect(() => {
    const ws = new WebSocket("wss://orca-uatwss.enrichmoney.in/ws");

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(JSON.stringify({ token: trade.broadcast_token }));
    };

    ws.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        const newLastPrice = parseFloat(data.last_price);
        if (!isNaN(newLastPrice) && newLastPrice !== lastPrice) {
          setLastPrice(newLastPrice);

          // Calculate and update PnL
          const pnl = (
            (newLastPrice - parseFloat(trade.avg_price)) *
            trade.quantity
          ).toFixed(2);
          if (onPnLChange) {
            onPnLChange(parseFloat(pnl));
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [trade, lastPrice, onPnLChange]);

  const pnl =((lastPrice - parseFloat(trade.avg_price)) * trade.quantity).toFixed(2)
    ;

  const isPositivePnL = pnl >= 0;

  return (
    <div className="bg-white rounded-lg mb-4 shadow transition-all duration-300">
      <div
        onClick={handleToggleExpand}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 cursor-pointer"
      >
        <div className="flex-1">
          <div className="text-lg font-semibold text-gray-700">
            {trade.display_name || "N/A"}
          </div>

          <div className="text-left flex justify-start md:justify-normal items-center md:items-start md:flex-col">
            <div className="text-lg font-semibold flex items-center">
              <span className={isPositivePnL ? "text-green-500" : "text-red-500"}>
                {pnl}
              </span>
              <span className="ml-1">
                {lastPrice && lastPrice >= trade.avg_price ? (
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
              {lastPrice && lastPrice >= trade.avg_price ? "Profit" : "Loss"}
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center">
          <div className="flex space-x-4 md:grid grid-cols-4 mt-4 md:mt-0 w-full">
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-500">Trade Type</div>
              <div className="text-lg font-semibold text-gray-800">
                {trade.trade_type}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-500">Avg. Price</div>
              <div className="text-lg font-semibold text-gray-800">
                {trade.avg_price.toFixed(2)}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-500">Quantity</div>
              <div className="text-lg font-semibold text-gray-800">
                {trade.quantity}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-500">Invested</div>
              <div className="text-lg font-semibold text-gray-800">
                {trade.invested_coin.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <EllipsisVerticalIcon className="hidden ml-4 lg:block h-6 w-6 text-gray-500" />
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ${
          isExpanded ? "max-h-screen" : "max-h-0"
        }`}
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
  );
};

export default TradeCard;
