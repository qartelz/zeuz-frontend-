import React, { useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import BuySellSub from "./BuySellSub";
import { WebSocketTrade, useWebSocketTrade } from "./WebSocketTrade";
import TradeCard from "./TradeCard";

const OpenOrders = ({ trades, maxTrades, refreshTrades }) => {
  const openTrades = trades.filter(
    (trade) => trade.trade_status === "incomplete"
  );

  const { lastPrice } = useWebSocketTrade(); // Access live prices
  const [expandedTradeIndex, setExpandedTradeIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);

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
    const currentPrice = lastPrice;

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
      {openTrades.length > 0 ? (
        displayedTrades.map((trade) => (
          <TradeCard key={trade.id || trade.token_id}
           trade={trade}
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
    </>
  );
};

export default OpenOrders;
