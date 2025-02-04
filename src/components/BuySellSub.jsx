// BuySellSub.js
import React, { useState, useEffect, useMemo } from "react";

import {
 
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import Alert from "@mui/material/Alert";
import { useWebSocket } from "../utils/WebSocketContext";


const BuySellSub = ({
  selectedData,
  selectedTrade,
  onClose,
  initialIsBuy,
  setModalOpen,
  onTradeSuccess,
  productType,
  quantity,
}) => {
  const authDataString = localStorage.getItem("authData");
  const authData = authDataString ? JSON.parse(authDataString) : null;
  const accessToken = authData?.access;
  const user_id = authData?.user_id;
  const broadcast_token = authData?.broadcast_token;

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [margin, setMargin] = useState("0.00");
  const marginValue = parseFloat(margin);

  const { tokenPrices, sendTouchlineRequest } = useWebSocket();

  const touchline = useMemo(
    () => `${selectedData.exchange}|${selectedData.token_id}`,
    [selectedData.exchange, selectedData.token_id]
  );
  const [isBuy, setIsBuy] = useState(initialIsBuy);

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
    }, 10);

    return () => clearInterval(checkDataTimer);
  }, [
    touchline,
    sendTouchlineRequest,
    tokenData.lastPrice,
    connectionAttempts,
  ]);

  // Log to help with debugging
  useEffect(() => {
    console.log(`${touchline} - Updated Price: ${tokenData.lastPrice}`);
  }, [tokenData.lastPrice, touchline]);

  console.log(productType, "the product type");

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isDelivery] = useState();


  const [quantitys, setQuantitys] = useState(quantity);
  console.log(quantity, "the quantiqqqqqqqqqqqqqqqqqqqq");

  const lotSize = selectedTrade?.lot_size || 1;
  const [errorMessage, setErrorMessage] = useState("");

  

  

  const handleIncrease = () => {
    setQuantitys((prev) => {
      if (!isBuy && selectedTrade.exchange === "NSE") {
        if (prev + lotSize > quantity) {
          setErrorMessage("Maximum quantity limit reached.");
          setTimeout(() => setErrorMessage(""), 3000);
          return quantity; // Set the value to quantity if it exceeds
        }
      }
      setErrorMessage("");
      return prev + lotSize;
    });
  };

  const handleDecrease = () => {
    setErrorMessage("");
    setQuantitys((prev) => Math.max(lotSize, prev - lotSize));
  };
  

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/^0+/, "");
  
    if (value === "") {
      setQuantitys("");
      setErrorMessage("");
    } else {
      const parsedValue = parseInt(value, 10);
  
      if (!isNaN(parsedValue)) {
        if (!isBuy && selectedTrade.exchange === "NSE" && parsedValue > quantity) {
          setErrorMessage("Maximum quantity limit reached.");
          setTimeout(() => setErrorMessage(""), 3000);
          setQuantitys(quantity);
        } else {
          setErrorMessage("");
          setQuantitys(parsedValue);
        }
      }
    }
  };
  

  const [selectedOrderType, setSelectedOrderType] = useState("Market Order");

  const [ setBeetleCoins] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");

    if (email) {
      const fetchBeetleCoins = async () => {
        try {
          const response = await fetch(
            `${baseUrl}/get-beetle-coins/?email=${email}`
          );
          const data = await response.json();
          setBeetleCoins(data);
        } catch (error) {
          console.error("Error fetching Beetle Coins:", error);
        }
      };

      fetchBeetleCoins();
    }
  }, [setBeetleCoins,baseUrl]);
    

  const handleTrade = async () => {
    if (!selectedTrade) {
      alert("Please select a stock.");
      return;
    }
    // Validate price only if it's a Limit Order
 

    const tradeData = {
      user: user_id,
      token_id: selectedData.token_id,
      exchange: selectedData.exchange || "NSE",
      trading_symbol: selectedData.trading_symbol || "",
      series: selectedData.series || "EQ",
      lot_size: selectedData.lot_size || 0,
      quantity: quantitys || 0,
      display_name: selectedData.display_name || "",
      company_name: selectedData.company_name || "",
      expiry_date: selectedData.expiry_date || null,
      segment: selectedData.segment || "EQUITY",
      option_type: selectedData.option_type || null,
      trade_type: isBuy ? "Buy" : "Sell",
      // avg_price: tokenData.lastPrice || 0,
      avg_price:
        selectedOrderType === "Market Order"
          ? tokenData.lastPrice || 0 // Use last price for market orders
          : limitPrice || 0,
      prctype: selectedOrderType === "Market Order" ? "MKT" : "LMT",
      invested_coin: marginValue,
      trade_status: "incomplete",
      ticker: selectedData.ticker || "",
      margin_required: 4159.25,
      product_type: productType,
    };
    if (tokenData.lastPrice <= 0) {
      alert("Cannot execute trade: Invalid price.");
      return;
    }

    const apiUrl =
      selectedData.exchange === "NSE"
        ? `${baseUrl}/trades/create-trades/`
        : selectedData.exchange === "NFO"
        ? `${baseUrl}/trades/create-futures/`
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

        onTradeSuccess();
        setAlertMessage(result.message);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setModalOpen(false);
          onTradeSuccess();
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

  const [limitPrice, setLimitPrice] = useState(tokenData.lastPrice);
  useEffect(() => {
    if (selectedOrderType === "Market Order") {
      setLimitPrice(tokenData.lastPrice);
    }
  }, [tokenData.lastPrice, selectedOrderType]);

  const priceType = selectedOrderType === "Market Order" ? "MKT" : "LMT";

  console.log(margin, "the narrrrrrrrrrrrrrrrr");
  const [ setError] = useState(null);

  useEffect(() => {
    const fetchOrderMargin = async () => {
      try {
        const response = await fetch(
          "https://orca-uatapi.enrichmoney.in/order-api/v1/order/margin",
          {
            method: "POST",
            headers: {
              Authorization: `${broadcast_token}`,
              "user-Id": "KE0070",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: "KE0070",
              exchange: selectedData.exchange,
              trading_symbol: selectedData.trading_symbol,
              price:
                selectedOrderType === "Market Order"
                  ? tokenData.lastPrice
                  : limitPrice,
              quantity: quantitys,
              price_type: priceType,
              product_type: isDelivery ? "M" : "I",
              transaction_type: isBuy ? "B" : "S",
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
        console.log(data, "Response from fetchOrderMargin");
        if (data.success) {
          setMargin(data.data.order_margin);
        } else {
          setError("Failed to fetch order margin");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
       
      }
    };

    console.log(fetchOrderMargin, "the order marginssssss");

    fetchOrderMargin();
  }, [setError,
    selectedData.trading_symbol,
    broadcast_token,
    selectedData.exchange,
    setBeetleCoins,
    tokenData.lastPrice,
    quantitys,
    isBuy,
    isDelivery,
    selectedOrderType,
    priceType,
    limitPrice,
    
  ]);

  return (
    <div className=" bg-transparent rounded-md space-y-4 relative pt-16   px-10 ">
      {showAlert && (
        <div className="absolute top-0 left-0 w-full z-50  px-4">
          <Alert variant="filled" severity="success">
            {alertMessage}
          </Alert>
        </div>
      )}

      <div className="flex items-end justify-end space-x-2">
        <div className="relative flex w-40   h-10  border border-gray-400  rounded-full p-1">
          <button
            className={`absolute left-2  h-8 w-16 rounded-full flex items-center justify-center transform transition-transform ${
              isBuy
                ? "bg-green-500 translate-x-0"
                : "bg-red-500 translate-x-[120%]"
            }`}
            onClick={() => {
              setIsBuy(!isBuy); 
              setQuantitys(quantity); 
            }}
            
          >
            {isBuy ? (
              <p className="text-white">Buy</p>
            ) : (
              <p className="text-white">Sell</p>
            )}
          </button>

          {/* Buy Label */}
          <span
            className={`flex-1 text-center text-sm font-bold ${
              isBuy ? "text-green-500" : "text-gray-500"
            }`}
          ></span>
          {/* Sell Label */}
          <span
            className={`flex-1 text-center text-sm font-bold ${
              !isBuy ? "text-red-500" : "text-gray-500"
            }`}
          ></span>
        </div>
      </div>

      <div className="bg-white text-black font-bold text-xl shadow-sm p-2 rounded-md">
        <span>{selectedData?.display_name || "No stock selected"}</span>
      </div>

      <div className="flex w-full justify-between items-center mb-4 border p-2 rounded-md bg-white">
        <div className="flex w-full">
          <button
            className={`w-1/2 px-6 py-2 rounded-l-md ${
              productType === "Delivery"
                ? "bg-[#E8FCF1] text-green-500 border font-bold"
                : "bg-transparent text-[#7D7D7D] border"
            }`}
          >
            Delivery
          </button>
          <button
            className={`w-1/2 px-6 py-2 rounded-r-md ${
              productType === "Intraday"
                ? "bg-[#E8FCF1] text-blue-500 border font-bold"
                : "bg-transparent text-[#7D7D7D] border"
            }`}
          >
            Intraday
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
            value={quantitys}
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
        <div style={{ minHeight: "15px" }}>
          {" "}
          {/* Reserve space for error message */}
          {errorMessage && (
            <p className="text-[10px] font-medium" style={{ color: "red" }}>
              {errorMessage}
            </p>
          )}
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

        <div className="relative w-full">
          <label
            htmlFor="lastPrice"
            className="absolute mt-4 font-semibold left-2 rounded-md top-[-10px] text-xs text-[#7D7D7D] bg-white px-1"
          >
            Amount. (BTLS)
          </label>
          <input
            type="number"
            id="lastPrice"
            value={margin}
            className="w-full p-2 text-[#7D7D7D] mt-4 border bg-white rounded-md"
            readOnly
          />
        </div>
      </div>

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
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BuySellSub;
