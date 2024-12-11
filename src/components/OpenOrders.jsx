import React, { useCallback, useState } from "react";
import BuySellSub from "./BuySellSub";
import { WebSocketTrade, useWebSocketTrade } from "./WebSocketTrade";
import TradeCard from "./TradeCard";

const OpenOrders = ({ trades, maxTrades, refreshTrades }) => {

  const [pnlMap, setPnlMap] = useState({});

   // Function to update PnL for a specific trade
   const handlePnLUpdate = (tradeId, newPnL) => {
    setPnlMap((prev) => {
      if (prev[tradeId] !== newPnL) {
        return {
          ...prev,
          [tradeId]: newPnL,
        };
      }
    
    });
  };
  const memoizedHandlePnLUpdate = useCallback(
    (tradeId, newPnL) => handlePnLUpdate(tradeId, newPnL),
    []
  );
  

  const totalPnL = Object.values(pnlMap).reduce((acc, pnl) => acc + pnl, 0).toFixed(2);



  const openTrades = trades.filter(
    (trade) => trade.trade_status === "incomplete"
  );

  console.log(openTrades,"eeeeeeeeeeeeeeeeee eeeeeeeeeeee eeeeeeeeeeeeeee eeeee")
  


  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);

  

  const displayedTrades = maxTrades ? openTrades.slice(0, maxTrades) : openTrades;

  const handleOpenModal = (trade) => {
    setSelectedTrade(trade);
    setModalOpen(true);
  };

  
  return (
    <>
      <div className="max-w-5xl mx-auto mt-8 p-4">
      {displayedTrades.length > 0 ? (
        displayedTrades.map((trade) => (
          <TradeCard key={trade.id || trade.token_id}
           trade={trade}
           onPnLChange={(newPnL) => memoizedHandlePnLUpdate(trade.token_id, newPnL)} 
           onOpenModal={handleOpenModal} />
        ))
      ) : (
        <p className="text-center text-gray-500">No Open Positions available.</p>
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

     {/* Display total PnL */}
     <div className="p-4 mb-4 bg-white shadow-md rounded">
        <h2 className="text-lg font-semibold text-gray-800">Total PnL</h2>
        <p className={`text-lg font-semibold ${totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
          {totalPnL}
        </p>
      </div>
    

      
    </>
  );
};

export default OpenOrders;
