import React, { useEffect, useState, useMemo } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useWebSocket } from "../utils/WebSocketContext";

const TradeCard = ({ trade, onOpenModal, onPnLUpdate }) => {
  const { tokenPrices, sendTouchlineRequest } = useWebSocket();

  const touchline = useMemo(
    () => `${trade.exchange}|${trade.token_id}`,
    [trade.exchange, trade.token_id]
  );

  const tokenData = useMemo(
    () =>
      tokenPrices[touchline] || {
        lastPrice: "0.00",
        volume: "0.00",
        percentChange: "0.00",
      },
    [tokenPrices, touchline]
  );
  useEffect(() => {
    sendTouchlineRequest(touchline);
  }, [touchline, sendTouchlineRequest, tokenPrices]);

  const [connectionAttempts, setConnectionAttempts] = useState(0);

  useEffect(() => {
    sendTouchlineRequest(touchline);

    const checkDataTimer = setInterval(() => {
      if (tokenData.lastPrice === "0.00") {
        sendTouchlineRequest(touchline);
        setConnectionAttempts((prev) => prev + 1);
        console.log(
          `Retry touchline request for ${touchline}. Attempt: ${
            connectionAttempts + 1
          }`
        );
      } else {
        clearInterval(checkDataTimer);
      }
    }, 10000);

    return () => clearInterval(checkDataTimer);
  }, [
    touchline,
    sendTouchlineRequest,
    tokenData.lastPrice,
    connectionAttempts,
  ]);

  // const pnl = useMemo(() => {
  //   return tokenData.lastPrice && parseFloat(tokenData.lastPrice) !== 0
  //     ? (
  //         (parseFloat(tokenData.lastPrice) - parseFloat(trade.avg_price)) *
  //         parseFloat(trade.quantity)
  //       ).toFixed(2)
  //     : "N/A";
  // }, [tokenData.lastPrice, trade.avg_price, trade.quantity]);
  const pnl = useMemo(() => {
    if (!tokenData.lastPrice || parseFloat(tokenData.lastPrice) === 0) {
      return "N/A"; // Return "N/A" if lastPrice is invalid
    }
  
    const lastPrice = parseFloat(tokenData.lastPrice);
    
    const avgPrice = parseFloat(trade.avg_price);
    const quantity = parseFloat(trade.quantity);
  
    const pnlValue =
      trade.trade_type === "Buy"
        ? ( lastPrice - avgPrice ) * quantity // Buy: (Current - Average) * Quantity
        : ( avgPrice -lastPrice ) * quantity; // Sell: (Average - Current) * Quantity
  
    return pnlValue.toFixed(2);
  }, [tokenData.lastPrice, trade.avg_price, trade.quantity, trade.trade_type]);
  
  
  // const isPositive = pnl !== "N/A" && parseFloat(pnl) >= 0;
  const isPositive = useMemo(() => pnl !== "N/A" && parseFloat(pnl) >= 0, [pnl]);

  useEffect(() => {
    if (pnl !== "N/A") {
      onPnLUpdate(parseFloat(pnl));
    }
  }, [pnl, onPnLUpdate]);
  
  // useEffect(() => {
  //   if (pnl !== "N/A") {
  //     onPnLUpdate(parseFloat(pnl));
  //   }
  // }, [pnl, onPnLUpdate]);


  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleOpenModal = () => {
    onOpenModal(trade);
  };

  useEffect(() => {
    console.log(`${touchline} - Updated Price: ${tokenData.lastPrice}`);
  }, [tokenData.lastPrice, touchline]);

  return (
    <div className="bg-white rounded-lg mb-4 shadow transition-all duration-300">
      <div
        onClick={handleToggleExpand}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 cursor-pointer"
      >
        <div className="w-full md:w-2/6">
          <div className="text-xl font-semibold text-gray-700">
            {trade.display_name || "N/A"}
          </div>

          <div className="grid grid-cols-2 mt-3 ">
            <div className="text-left flex justify-v md:justify-normal items-center md:items-start md:flex-col">
              <div className="text-lg font-semibold flex items-center">
                <span
                  className={isPositive ? "text-green-500" : "text-red-500"}
                >
                  {pnl}
                </span>
                <span className="ml-1">
                  {pnl !== "N/A" && isPositive ? (
                    <ChevronUp className="w-4 h-4 mr-1 text-green-500" />
                  ) : pnl !== "N/A" && !isPositive ? (
                    <ChevronDown className="w-4 h-4 mr-1 text-red-500" />
                  ) : null}
                </span>
              </div>

              <div className="text-xs font-medium text-gray-500">
                {pnl === "N/A" ? "" : pnl >= 0 ? "Profit" : "Loss"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center">
          <div className="flex space-x-2 md:grid text-center grid-cols-6 mt-4 md:mt-0 w-full">
            <div className="flex flex-col space-y-2">
              <div className="text-sm font-medium text-gray-500">
                LTP.
              </div>
              <div className="text-xl font-semibold text-gray-500">
              {tokenData.lastPrice}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="text-sm font-medium text-gray-500">
                Trade Type
              </div>
              <div className="text-md font-semibold text-gray-800">
                {trade.trade_type}
              </div>
            </div>
            <div className="flex  flex-col space-y-2 ">
              <div className="text-sm  whitespace-nowrap font-medium text-gray-500">Product Type</div>
              <div className="text-md font-semibold text-gray-800">
                {trade.product_type.charAt(0).toUpperCase() +
                  trade.product_type.slice(1)}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="text-sm font-medium text-gray-500">
                Avg. Price
              </div>
              <div className="text-md font-semibold text-gray-800">
                <span>{trade.avg_price.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="text-sm font-medium text-gray-500">Quantity</div>
              <div className="text-md font-semibold text-gray-800">
                {trade.quantity}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="text-sm font-medium text-gray-500">Invested</div>
              <div className="text-md font-semibold text-gray-800">
                {trade.invested_coin.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <EllipsisVerticalIcon className="hidden lg:block h-6 w-6 text-gray-500" />
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
