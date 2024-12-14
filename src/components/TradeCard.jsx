import React, { useCallback, useEffect, useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { ChevronUp, ChevronDown } from "lucide-react";
const TradeCard = ({ trade, onOpenModal, onPnLUpdate }) => {
  const [lastPrice, setLastPrice] = useState(trade.avg_price || "0.00");


  useEffect(() => {
    const interval = setInterval(() => {
      setLastPrice((prevPrice) => {
        let newPrice = prevPrice + (Math.random() * 3); // Increment by a random number between 0 and 3
        if (newPrice > 295) newPrice = 285 + (Math.random() * 3); // Reset to 285-295 range
        return parseFloat(newPrice.toFixed(2)); // Limit to two decimal places
      });
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);




  const [isExpanded, setIsExpanded] = useState(false);

  const calculatePnL = useCallback(() => {
    const pnl = parseFloat(lastPrice) - parseFloat(trade.avg_price);
    return pnl.toFixed(2);
  }, [lastPrice, trade.avg_price]);



  useEffect(() => {
    // Notify the parent of the updated PnL
    const pnl = parseFloat(calculatePnL());
    onPnLUpdate(pnl, trade.id);
  }, [lastPrice, calculatePnL, onPnLUpdate, trade.id]);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleOpenModal = () => {
    onOpenModal(trade);
  };

  useEffect(() => {
    const ws = new WebSocket("wss://orca-uatwss.enrichmoney.in/ws");
    const touchlineInterval = 5000; // 5 seconds
    let touchlineTimer;

    ws.onopen = () => {
      console.log(`WebSocket connected for trade: ${trade.display_name}`);

      const initialData = {
        t: "c",
        uid: "KE0070",
        actid: "KE0070",
        susertoken:
          "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIiwiaWF0IjoxNzM0MTcyNjMxLCJleHAiOjE3MzQyMjI2MDAsInN1YmplY3RfaWQiOiJLRTAwNzAiLCJwYXJ0bmVyX2NoYW5uZWwiOiJBUEkiLCJwYXJ0bmVyX2NvZGUiOiJLRTAwNzAiLCJ1c2VyX2lkIjoiS0UwMDcwIiwibGFzdF92YWxpZGF0ZWRfZGF0ZV90aW1lIjoxNzM0MTcyNjMxNzI0LCJpc3N1ZXJfaWQiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIn0.K2v9XnfeFnqPt0mNXvqUDlGpS6B5dap38IzuQt7vVfU", // Replace with a dynamic or environment-based token
        source: "API",
      };
      ws.send(JSON.stringify(initialData));

      // Send touchline data periodically
      touchlineTimer = setInterval(() => {
        ws.send(
          JSON.stringify({
            t: "t",
            k: `${trade.exchange}|${trade.token_id}`,
          })
        );
      }, touchlineInterval);
    };

    ws.onmessage = (event) => {
      console.log(`Message for ${trade.display_name}:`, event.data);
      try {
        const data = JSON.parse(event.data);
        // if (data.lp) setLastPrice(data.lp);


      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error for ${trade.display_name}:`, error);
    };

    ws.onclose = () => {
      console.log(`WebSocket disconnected for ${trade.display_name}`);
    };

    return () => {
      clearInterval(touchlineTimer);
      ws.close();
    };
  }, [trade]);

  return (
    <>
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
                {(() => {
                  const pnl = (
                    (parseFloat(lastPrice) - parseFloat(trade.avg_price)) * parseFloat(trade.quantity)
                  ).toFixed(2);
                  const isPositive = pnl >= 0; 
                  return (
                    <>
                      <span
                        className={
                          isPositive ? "text-green-500" : "text-red-500"
                        }
                      >
                        ₹{pnl}
                      </span>
                      <span className="ml-1">
                        {pnl >= 0 ? (
                          <ChevronUp className="w-4 h-4 mr-1 text-green-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 mr-1 text-red-500" />
                        )}
                      </span>
                    </>
                  );
                })()}
              </div>
              <div className="text-sm font-medium text-gray-500">
                {parseFloat(lastPrice) >= parseFloat(trade.avg_price)
                  ? "Profit"
                  : "Loss"}
              </div>
            </div>
          </div>

          <div className="flex flex-1 items-center">
            <div className="flex space-x-4 md:grid grid-cols-4 mt-4 md:mt-0 w-full">
              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-500">
                  Trade Type 
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {trade.trade_type}
                 
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-500">
                  Avg. Price
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  <span>{trade.avg_price.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-500">
                  Quantity
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {trade.quantity}
                </div>
              </div>

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
    </>
  );
};

export default TradeCard;
