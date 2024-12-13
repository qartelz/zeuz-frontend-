// BuySellSub.js
import React, { useState, useEffect } from "react";
import {
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import BeetleBalance from "./BeetleBalance";
import { useWebSocketTrade } from "./WebSocketTrade";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const BuySellSub = ({ selectedData, selectedTrade, onClose, initialIsBuy, setModalOpen, onTradeSuccess }) => {

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isDelivery, setIsDelivery] = useState(false);

  const { lastPrice } = useWebSocketTrade();


  const authDataString = localStorage.getItem("authData");
  const authData = authDataString ? JSON.parse(authDataString) : null;
  const accessToken = authData?.access;
  const user_id = authData?.user_id;

  
  const [quantity, setQuantity] = useState(1); 

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/^0+/, "");
    if (value === "") {
      setQuantity("");
    } else {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue)) {
        setQuantity(parsedValue);
      }
    }
  };
  


  const [selectedOrderType, setSelectedOrderType] = useState("Market Order");
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);

  const [isBuy, setIsBuy] = useState(initialIsBuy);

  
  const [beetleCoins, setBeetleCoins] = useState(null);



  useEffect(() => {
    const email = localStorage.getItem("email");

    if (email) {
      const fetchBeetleCoins = async () => {
        try {
          const response = await fetch(
            `https://backend.beetlezeuz.in/get-beetle-coins/?email=${email}`
          );
          const data = await response.json();
          setBeetleCoins(data);
        } catch (error) {
          console.error("Error fetching Beetle Coins:", error);
        }
      };

      fetchBeetleCoins();
    }
  }, []);

  const handleTrade = async () => {
    if (!selectedTrade) {
      alert("Please select a stock.");
      return;

    }

    const tradeData = {
      user: user_id,
      token_id: selectedData.token_id,
      exchange: selectedData.exchange || "NSE",
      trading_symbol: selectedData.trading_symbol || "",
      series: selectedData.series || "EQ",
      lot_size: selectedData.lot_size || 0,
      quantity: quantity || 0,
      display_name: selectedData.display_name || "",
      company_name: selectedData.company_name || "",
      expiry_date: selectedData.expiry_date || null,
      segment: selectedData.segment || "EQUITY",
      option_type: selectedData.option_type || null,
      trade_type: isBuy ? "Buy" : "Sell",
      avg_price: lastPrice || 0,
      prctype: selectedOrderType === "Market Order" ? "MKT" : "LMT",
      invested_coin: (lastPrice || 0) * quantity,
      trade_status: "incomplete",
      ticker: selectedData.ticker || "",
      margin_required: 4159.25,
    };
    if (lastPrice <= 0) {
      alert("Cannot execute trade: Invalid price.");
      return;
    }


    const apiUrl =
      selectedData.exchange === "NSE"
        ? "https://backend.beetlezeuz.in/trades/create-trades/"
        : selectedData.exchange === "NFO"
          ? "https://backend.beetlezeuz.in/trades/create-futures/"
          : null;

    if (!apiUrl) {
      console.error("Invalid segment:", selectedData.segment);
      return;
    }



    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(tradeData),
      });


      if (response.ok) {
        const result = await response.json();
        console.log("Trade created successfully:", result);
        // alert("Trade created successfully!");
        
        onTradeSuccess();
        setAlertMessage(result.message);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setModalOpen(false);
        onTradeSuccess(); // Notify parent after modal closes
      }, 3000);
      } else {
        console.error("Error creating trade:", response.statusText);
        alert("Failed to create trade. Please try again.");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className=" bg-transparent rounded-md space-y-4 relative pt-16   px-10 ">
       {showAlert && (
    <div className="absolute top-0 left-0 w-full z-50  px-4">
      <Alert variant="filled" severity="success">{alertMessage}
</Alert>


    </div>
  )}
      <div className="flex items-center space-x-4 whitespace-nowrap">
        <BeetleBalance />
        {beetleCoins && (
          <div className="bg-white text-[#7D7D7D] border shadow-sm p-2 rounded-md">
            <span>Beetle Coins: {beetleCoins.amount}</span>
          </div>
        )}
      </div>

      <div className="bg-white text-[#7D7D7D] border shadow-sm p-2 rounded-md">
        <span>{selectedData?.display_name || "No stock selected"}</span>
      </div>

      <div className="flex items-center justify-between space-x-2">
        <span className="text-[#7D7D7D] text-xl font-bold">I want to:</span>
        <div className="flex space-x-2">
          <button
            className={`px-8 py-2 rounded-md ${isBuy
                ? "bg-[#E8FCF1] text-green-500 border font-bold"
                : "bg-transparent text-[#7D7D7D]"
              }`}
            onClick={() => setIsBuy(true)}
          >
            Buy
          </button>
          <button
            className={`px-8 py-2 rounded-md ${!isBuy
                ? "bg-[#E8FCF1] text-red-500 border font-bold"
                : "bg-transparent text-[#7D7D7D]"
              }`}
            onClick={() => setIsBuy(false)}
          >
            Sell
          </button>
        </div>
      </div>

      <div className="space-y-2">
      <div className="flex items-center justify-between bg-white text-[#7D7D7D] border shadow-sm p-2 rounded-md">
          <span className="mr-4">Quantity:</span>
          <MinusIcon
            onClick={handleDecrease}
            className="w-4 h-4 cursor-pointer"
          />
          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            className="w-16 text-center border border-gray-300 rounded-md focus:outline-none"
            min="0"
          />
          <div className="flex items-center space-x-2">
            <PlusIcon
              onClick={handleIncrease}
              className="w-4 h-4 cursor-pointer"
            />
          </div>
        </div>


        <div className="relative w-full">
          <label
            htmlFor="lastPrice"
            className="absolute mt-4 font-semibold left-2 rounded-md top-[-10px] text-xs text-[#7D7D7D] bg-white px-1"
          >
            Price. (BTLS)
          </label>
          <input
            type="number"
            id="lastPrice"
            value={lastPrice * quantity * (selectedData?.lot_size || 0)}
            className="w-full p-2 text-[#7D7D7D] mt-4 border bg-white rounded-md"
            readOnly
          />
        </div>

        <div className="relative">
          <div
            className="flex items-center justify-between bg-white text-[#7D7D7D] border p-2 rounded-md cursor-pointer"
            onClick={() => setIsOrderDropdownOpen(!isOrderDropdownOpen)}
          >
            <span>{selectedOrderType}</span>
            <ChevronDownIcon className="w-4 h-4" />
          </div>
          {isOrderDropdownOpen && (
            <div className="absolute mt-2 bg-white border rounded-md shadow-lg z-10">
              <button
                className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                onClick={() => {
                  setSelectedOrderType("Market Order");
                  setIsOrderDropdownOpen(false);
                }}
              >
                Market Order
              </button>
              <button
                className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                onClick={() => {
                  setSelectedOrderType("Limit Order");
                  setIsOrderDropdownOpen(false);
                }}
              >
                Limit Order
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex px-10 text-white text-bold space-x-2">
        <button
          className={`w-full px-2 py-2 rounded-md ${isBuy ? "bg-green-800" : "bg-[#D83232]"
            } text-white`}
          onClick={handleTrade}
        >
          {isBuy ? "Buy" : "Sell"}
        </button>

        <button
          className="w-full bg-gray-500 py-2 rounded-md"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BuySellSub;
