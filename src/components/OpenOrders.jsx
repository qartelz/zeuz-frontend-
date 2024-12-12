import React, { useCallback, useState, useMemo } from "react";
import BuySellSub from "./BuySellSub";
import { WebSocketTrade, useWebSocketTrade } from "./WebSocketTrade";
import TradeCard from "./TradeCard";

const OpenOrders = ({ trades, maxTrades, refreshTrades }) => {
  const [pnlMap, setPnlMap] = useState({}); // Mapping of trade IDs to PnL values

  // Memoized function to update PnL for a specific trade
  const handlePnLUpdate = useCallback((pnl, tradeId) => {
    setPnlMap((prevMap) => {
      const newMap = { ...prevMap, [tradeId]: pnl };
      return newMap;
    });
  }, []);

  // Calculate the total PnL dynamically
  const totalPnL = Object.values(pnlMap).reduce((sum, pnl) => sum + pnl, 0);

  const openTrades = trades.filter(
    (trade) => trade.trade_status === "incomplete"
  );

  const sortedTrades = openTrades.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  console.log(
    openTrades,
    "eeeeeeeeeeeeeeeeee eeeeeeeeeeee eeeeeeeeeeeeeee eeeee"
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);

  const displayedTrades = maxTrades
  ? sortedTrades.slice(0, maxTrades)
  : sortedTrades;

  const handleOpenModal = (trade) => {
    setSelectedTrade(trade);
    setModalOpen(true);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto mt-8 p-4">
        {displayedTrades.length > 0 ? (
          <>
          {displayedTrades.length > 4 && 
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex flex-col text-center">
                  <span className="text-sm font-medium text-gray-500">
                    Total Trades
                  </span>
                  <span className="text-lg font-semibold text-gray-800">
                    {displayedTrades.length}
                  </span>
                </div>
                <div className="flex flex-col text-center">
                  <span className="text-sm font-medium text-gray-500">
                    Total Investment
                  </span>
                  <span className="text-lg font-semibold text-gray-800">
                    {/* ₹{totalInvestment.toFixed(2)} */}
                  </span>
                </div>
                <div className="flex flex-col text-center">
                  <span className="text-sm font-medium text-gray-500">
                    Current Value
                  </span>
                  <span className="text-lg font-semibold text-gray-800">
                    {/* ₹{currentValue.toFixed(2)} */}
                  </span>
                </div>
                <div className="flex flex-col text-center">
                  <span className="text-sm font-medium text-gray-500">
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
                    ₹{totalPnL.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            } 

            {displayedTrades.map((trade) => (
              <TradeCard
                key={trade.id || trade.token_id}
                trade={trade}
                onPnLUpdate={handlePnLUpdate}
                onOpenModal={handleOpenModal}
              />
            ))}
          </>
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
                  onClose={() => {
                    setModalOpen(false);
                  }}
                  initialIsBuy={selectedTrade.trade_type === "Sell"}
                  setModalOpen={setModalOpen}
                  onTradeSuccess={refreshTrades}
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
