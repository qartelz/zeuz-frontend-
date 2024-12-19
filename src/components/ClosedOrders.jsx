import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const ClosedOrders = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const authDataString = localStorage.getItem("authData");
  const authData = authDataString ? JSON.parse(authDataString) : null;
  const accessToken = authData?.access;

  const [visibleTrades, setVisibleTrades] = useState(100);
  const containerRef = useRef(null);

  const [trades, setTrades] = useState([]);

  const fetchTrades = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/trades/closed-trades/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setTrades(response.data);
        console.log(response, "the trade response");
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  };
  useEffect(() => {
    fetchTrades();
  }, [accessToken]);

  const totalPnL = trades.reduce((acc, trade) => {
  
    const profitLoss = parseFloat(trade.profit_loss);
    return acc + (isNaN(profitLoss) ? 0 : profitLoss);
  }, 0);

  console.log(trades, "the closedwwwwwwwwwwwwwwwwwwwwww  trades");

  // Calculate total investment, current value, total P&L, and average P&L
  const totalInvestment = trades.reduce(
    (sum, trade) => sum + trade.avg_price * trade.sell_quantity,
    0
  );

  // const totalPnL = trades.reduce((sum, trade) => sum + trade.profit_loss, 0);

  const calculateProfit = (trade) => {
    const profit = (trade.exit_price - trade.avg_price) * trade.sell_quantity;
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
      {trades.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex flex-col text-center">
                <span className="text-sm font-bold text-gray-500">
                  Total Closed Positions
                </span>
                <span className="text-lg font-semibold text-gray-800">
                  {trades.length}
                </span>
              </div>
              <div className="flex flex-col text-center">
                <span className="text-sm font-bold text-gray-500">
                  Total Investment
                </span>
                <span className="text-lg font-semibold text-gray-800">
                  {totalInvestment.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col text-center">
                <span className="text-sm font-bold text-gray-500">
                  Total P&L
                </span>
                <span
                  className={`text-lg font-semibold ${
                    totalPnL > 0
                      ? "text-green-600"
                      : totalPnL < 0
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {totalPnL.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-7 text-center gap-4 text-sm bg-gray-100 px-4 py-2 font-semibold text-gray-800">
              <div>Stock Name</div>
              <div>Order Type</div>
              <div>Entry Price</div>
              <div>Closing Price</div>
              <div>Quantity</div>

              <div>Profit / Loss</div>
              <div>Executed On</div>
            </div>
          </div>

          <div
            ref={containerRef}
            className="max-h-96 overflow-y-auto border text-center border-gray-300 rounded-lg"
          >
            {trades.slice(0, visibleTrades).map((trade, index) => {
              const profit = calculateProfit(trade);

              return (
                <div
                  key={trade.id || index}
                  className="grid grid-cols-7   items-center bg-white px-4 py-2 border-b border-gray-200"
                >
                  <div className="text-xs md:text-lg font-semibold text-gray-800">
                    {trade.display_name || "N/A"}
                  </div>
                  <div className="text-xs md:text-lg text-gray-800">
                    {trade.product_type.charAt(0).toUpperCase() +
                      trade.product_type.slice(1) || "N/A"}
                  </div>

                  <div className="text-xs md:text-lg text-gray-800">
                    {trade.avg_price.toFixed(2)}
                  </div>
                  <div className="text-xs md:text-lg text-gray-800">
                    {trade.sell_price}
                  </div>
                  <div className="text-xs md:text-lg text-gray-800">
                    {trade.sell_quantity}
                  </div>

                  <div
                    className={`text-xs md:text-lg  font-semibold ${
                      trade.profit_loss > 0
                        ? "text-green-600"
                        : trade.profit_loss < 0
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {parseFloat(trade.profit_loss).toFixed(2)}
                  </div>
                  <div className="text-xs  md:text-md font-medium text-gray-800">
                    {new Date(trade.sell_date).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
