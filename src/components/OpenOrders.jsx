import React, { useCallback, useState, useEffect } from "react";
import BuySellSub from "./BuySellSub";
import TradeCard from "./TradeCard";
import { useLocation } from "react-router-dom";
import axios from "axios";

const OpenOrders = ({ trades, maxTrades, refreshTrades }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const authDataString = localStorage.getItem("authData");
  const authData = authDataString ? JSON.parse(authDataString) : null;
  const accessToken = authData?.access;
  const user_id = authData?.user_id;
  const location = useLocation();

  const [pnlValues, setPnLValues] = useState({});
  const [totalPnL, setTotalPnL] = useState(0);
  const handlePnLUpdate = useCallback((newPnL, tradeId) => {
    setPnLValues((prevPnLValues) => ({ ...prevPnLValues, [tradeId]: newPnL }));
  }, [totalPnL]);
  useEffect(() => {
    const newTotalPnL = Object.values(pnlValues).reduce(
      (sum, pnl) => sum + pnl,
      0
    );
    setTotalPnL(newTotalPnL);
  }, [pnlValues]);

  const openTrades = trades.filter(
    (trade) => trade.trade_status === "incomplete"
  );

  const sortedTrades = openTrades.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // console.log(
  //   openTrades,
  //   "eeeeeeeeeeeeeeeeee eeeeeeeeeeee eeeeeeeeeeeeeee eeeee"
  // );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);

  const displayedTrades = maxTrades
    ? sortedTrades.slice(0, maxTrades)
    : sortedTrades;

  const handleOpenModal = (trade) => {
    setSelectedTrade(trade);
    setModalOpen(true);
  };

  const [totalProfitLoss, setTotalProfitLoss] = useState(null);
  const [totalAvbl, setTotalAvbl] = useState(null);
  const [totalInvested, setTotalInvested] = useState(null);

  useEffect(() => {
    const fetchProfitLoss = async () => {
      try {
        const response = await axios.get(`${baseUrl}/account/trade-summary/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTotalProfitLoss(response.data.total_profit_loss);
        setTotalAvbl(response.data.beetle_coins.coins);
        setTotalInvested(response.data.beetle_coins.used_coins);
      } catch (error) {
        console.error("Error fetching profit/loss data:", error);
      }
    };

    fetchProfitLoss();
  }, []);

  return (
    <>
      <div className="max-w-5xl mx-auto mt-8 p-4">
        {displayedTrades.length > 0 ? (
          <>
            {location.pathname === "/portfolio" && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
                <div className="flex flex-wrap justify-between items-center">
                  <div className="flex flex-col text-center">
                    <span className="text-sm font-bold text-gray-500">
                      Total Open Positions
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                      {displayedTrades.length}
                    </span>
                  </div>
                  {/* <div className="flex flex-col  text-center">
                    <span className="text-sm font-bold text-gray-500">
                      Total Investment
                    </span>
                    <span className="text-lg font-semibold text-gray-800">
                    {totalInvested}
                    </span>
                  </div> */}

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
            )}

            {displayedTrades.map((trade) => (
              <TradeCard
                key={trade.id || trade.token_id}
                trade={trade}
                onPnLUpdate={(newPnL) => handlePnLUpdate(newPnL, trade.id)}
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
                productType={selectedTrade.product_type}
                quantity={selectedTrade.quantity}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OpenOrders;
