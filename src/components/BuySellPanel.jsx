import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import BeetleBalance from "./BeetleBalance";
import Alert from "@mui/material/Alert";
import useWebSocketManager from "../utils/WebSocketManager";

const BuySellPanel = ({ selectedData, initialIsBuy }) => {
  const touchline = `${selectedData.exchange}|${selectedData.token_id}`;
  const { lastPrice } = useWebSocketManager(touchline);
  console.log(lastPrice,"the last pricccce")
  const navigate = useNavigate();

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isDelivery, setIsDelivery] = useState(true);

  const [quantity, setQuantity] = useState(selectedData.lot_size);
  const handleIncrease = () => {
    const lotSize = selectedData?.lot_size || 1;
    setQuantity((prev) => prev + lotSize);
  };

  const handleDecrease = () => {
    const lotSize = selectedData?.lot_size || 1;
    setQuantity((prev) => Math.max(lotSize, prev - lotSize));
  };

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

  console.log(selectedData, "the selected data is");

  const authDataString = localStorage.getItem("authData");
  const authData = authDataString ? JSON.parse(authDataString) : null;
  const accessToken = authData?.access;
  const user_id = authData?.user_id;

  // const { lastPrice } = useWebSocketStock();

  const [selectedOrderType, setSelectedOrderType] = useState("Market Order");
  const priceType = selectedOrderType === "Market Order" ? "MKT" : "LMT";

  
  const [limitPrice, setLimitPrice] = useState(lastPrice); 

  useEffect(() => {
    if (selectedOrderType === "Market Order") {
      setLimitPrice(lastPrice);
    }
  }, [lastPrice, selectedOrderType]); 
  
  

  const [isBuy, setIsBuy] = useState(null);
  const [isSell, setIsSell] = useState(null);

  console.log(initialIsBuy);

  const [beetleCoins, setBeetleCoins] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");

    if (email) {
      const fetchBeetleCoins = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/account/get-beetle-coins/?email=${email}`
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
    if (!selectedData) {
      alert("Please select a stock.");
      return;
    }
    if (lastPrice <= 0) {
      alert("Cannot execute trade: Invalid price.");
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

    const apiUrl =
      selectedData.exchange === "NSE"
        ? "http://127.0.0.1:8000/trades/create-trades/"
        : selectedData.exchange === "NFO"
        ? "http://127.0.0.1:8000/trades/create-futures/"
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

        setAlertMessage(result.message);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        setTimeout(() => {
          navigate("/portfolio");
        }, 4000);
      } else {
        console.error("Error creating trade:", response.statusText);
        alert("Failed to create trade. Please try again.");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const [margin, setMargin] = useState(null);
  console.log(margin,"the narrrrrrrrrrrrrrrrr")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderMargin = async () => {
      try {
        const response = await fetch(
          "https://orca-uatapi.enrichmoney.in/order-api/v1/order/margin",
          {
            method: "POST",
            headers: {
              Authorization:
                "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIiwiaWF0IjoxNzM0MjUwOTY2LCJleHAiOjE3MzQzMDkwMDAsInN1YmplY3RfaWQiOiJLRTAwNzAiLCJwYXJ0bmVyX2NoYW5uZWwiOiJBUEkiLCJwYXJ0bmVyX2NvZGUiOiJLRTAwNzAiLCJ1c2VyX2lkIjoiS0UwMDcwIiwibGFzdF92YWxpZGF0ZWRfZGF0ZV90aW1lIjoxNzM0MjUwOTY2NDMzLCJpc3N1ZXJfaWQiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIn0.ofBhYQO0tCfkhN3yfW7kNHLp9EMHkSZarFVRXpGkLvw",
              "user-Id": "KE0070",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: "KE0070",
              exchange: selectedData.exchange,
              trading_symbol: selectedData.trading_symbol,
              price: selectedOrderType === "Market Order" ? lastPrice : limitPrice,
              quantity: quantity,
              price_type: priceType,
              product_type: isDelivery ? "M" : "I",
              transaction_type:  isBuy ? "B" : "S",
              trigger_price: "",
              book_loss_price: "",
              book_profit_price: "",
              original_price: "",
              original_quantity: "",
              original_trigger_price: "",
              oms_partner_order_no: "",
              secondary_order_no: "",
              oms_partner_source: "kambala",
            }),
          }
        );
        const data = await response.json();
        if (data.success) {
          setMargin(data.data.order_margin);
        } else {
          setError("Failed to fetch order margin");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    console.log(fetchOrderMargin,"the order marginssssss")

    fetchOrderMargin();
  }, [lastPrice, quantity,isBuy,isDelivery,selectedOrderType,priceType,limitPrice  ]);

  return (
    <div className="px-4 bg-transparent rounded-md space-y-4 relative pt-12">
      {showAlert && (
        <div className="absolute top-0 left-0 w-full z-50">
          <Alert variant="filled" severity="success">
            {alertMessage}
          </Alert>
        </div>
      )}

      {/* Blurred Background Wrapper */}
      <div className=" p-4 bg-white/70 backdrop-blur-md rounded-xl space-y-4 shadow-md">
        <div className="flex items-center space-x-4 whitespace-nowrap">
          <BeetleBalance />

          {beetleCoins && (
            <div className="bg-white text-[#7D7D7D] border shadow-sm p-2 rounded-md">
              <span>Beetle Coins: {beetleCoins.amount}</span>
            </div>
          )}
        </div>

        {/* Stock Display */}
        <div className="bg-white text-black font-bold text-xl shadow-sm p-2 rounded-md">
          <span>{selectedData?.display_name || "No stock selected"}</span>
        </div>

        {/* I Want To Section */}

        {(isBuy == null || isSell == null) ? (

        <div className=" items-center justify-between space-x-2">
          <span className="text-2xl font-bold">{lastPrice}</span>
          <span className="text-sm text-[#7D7D7D]">Last Traded Price</span>

          
          
          <div className="flex w-full space-x-2 justify-around  mt-5">
         
            <button
              className="px-8 w-full py-2 rounded-md text-white bg-green-500 border font-bold"
              onClick={() => {
                setIsBuy(true);
                setIsSell(false); 
              }}
            >
              Buy
            </button>

            <button
              className="px-8 py-2 w-full rounded-md  text-white bg-red-500 border font-bold "
            
              onClick={() => {
                setIsBuy(false);
                setIsSell(true);
              }}
            >
              Sell
            </button>
          </div>
        </div>

) : (

        <div>

        {/* Delivery / Intraday Toggle */}
        <div className="flex w-full justify-between items-center mb-4 border p-2 rounded-md bg-white">
          <div className="flex w-full">
            <button
              className={`w-1/2 px-6 py-2 rounded-l-md ${
                isDelivery
                  ? "bg-[#E8FCF1] text-green-500 border font-bold"
                  : "bg-transparent text-[#7D7D7D] border"
              }`}
              onClick={() => setIsDelivery(true)}
            >
              Delivery
            </button>
            <button
              className={`w-1/2 px-6 py-2 rounded-r-md ${
                !isDelivery
                  ? "bg-[#E8FCF1] text-blue-500 border font-bold"
                  : "bg-transparent text-[#7D7D7D] border"
              }`}
              onClick={() => setIsDelivery(false)}
            >
              Intraday
            </button>
          </div>
        </div>

        {/* Quantity Section */}
        <div className="space-y-2">
          <div className="flex items-center bg-white text-[#7D7D7D] border shadow-sm p-2 rounded-md">
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

          <div className="relative border rounded-md p-3 bg-white w-64 h-[100px]">
            {/*Market Limit Buttons */}
            <div className="flex items-center gap-2">
              {["Market Order", "Limit Order"].map((orderType) => (
                <button
                  key={orderType}
                  className={`flex-1 p-2 text-sm font-medium rounded-md ${
                    selectedOrderType === orderType
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => {
                    setSelectedOrderType(orderType);
                    if (orderType === "Market Order");
                  }}
                >
                  {orderType}
                </button>
              ))}
            </div>

            {/* Conditional Input or Label */}
            <div className="mt-3">
              {selectedOrderType === "Market Order" ? (
                <span className="text-sm w-1/2 font-medium text-black border rounded-md px-2 py-1">
                  At Market
                </span>
              ) : (
                <input
                  type="number"
                  className="w-1/2 text-sm font-medium text-black border rounded-md px-2 py-1"
                  placeholder="Limit Price"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)} 
                />
              )}
            </div>
          </div>
        </div>

        {/* Required Price */}
        <div className="relative w-full">
          <label
            htmlFor="lastPrice"
            className="absolute mt-4 font-semibold left-2 rounded-md top-[-10px] text-xs text-[#7D7D7D] bg-white px-1"
          >
            Required Amount. (BTLS)
          </label>
          <input
            type="number"
            id="lastPrice"
            value={margin}
            className="w-full p-2 text-[#7D7D7D] mt-4 border bg-white rounded-md"
            readOnly
          />
        </div>

        {/* Action Buttons */}
        <div className="flex text-white text-bold mt-2 space-x-2">
          <button
            className={`w-full px-2 py-2 rounded-md ${
              isBuy ? "bg-green-800" : "bg-[#D83232]"
            } text-white`}
            onClick={handleTrade}
          >
            {isBuy ? "Buy" : "Sell"}
          </button>

          <button
            className="w-full bg-gray-500 py-2 rounded-md"
            onClick={() => {
              setIsBuy(null);
              setIsSell(null);
            }}
          >
            Cancel
          </button>
        </div>
        </div>
        )}
      </div>
      
    </div>
  );
};

export default BuySellPanel;
