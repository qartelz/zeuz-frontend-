// BuySellSub.js
import React, { useState, useEffect } from "react";
import {
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import BeetleBalance from "./BeetleBalance";
import { useWebSocketTrade } from "./WebSocketTrade";
import Alert from "@mui/material/Alert";
import useWebSocketManager from "../utils/WebSocketManager";

const BuySellSub = ({
  selectedData,
  selectedTrade,
  onClose,
  initialIsBuy,
  setModalOpen,
  onTradeSuccess,
  productType,
  quantity
}) => {
  const [margin, setMargin] = useState("0.00");
  const marginValue = parseFloat(margin);
  const touchline = `${selectedData.exchange}|${selectedData.token_id}`;
  const { lastPrice } = useWebSocketManager(touchline);
console.log(productType,"the product type")


  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isDelivery, setIsDelivery] = useState();
  console.log(isDelivery,"the devlojhvcxcvbn")



  const authDataString = localStorage.getItem("authData");
  const authData = authDataString ? JSON.parse(authDataString) : null;
  const accessToken = authData?.access;
  const user_id = authData?.user_id;
  
  const [quantitys, setQuantitys] = useState(quantity);
  console.log(quantity,"the quantiqqqqqqqqqqqqqqqqqqqq")
  

  const handleIncrease = () => setQuantitys((prev) => prev + 1);
  const handleDecrease = () => setQuantitys((prev) => Math.max(1, prev - 1));
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/^0+/, "");
    if (value === "") {
      setQuantitys("");
    } else {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue)) {
        setQuantitys(parsedValue);
      }
    }
  };

  const [selectedOrderType, setSelectedOrderType] = useState("Market Order");
  

  const [isBuy, setIsBuy] = useState(initialIsBuy);

  const [beetleCoins, setBeetleCoins] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");

    if (email) {
      const fetchBeetleCoins = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/get-beetle-coins/?email=${email}`
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
      invested_coin: marginValue,
      trade_status: "incomplete",
      ticker: selectedData.ticker || "",
      margin_required: 4159.25,
      product_type: productType,
    };
    if (lastPrice <= 0) {
      alert("Cannot execute trade: Invalid price.");
      return;
    }

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
  // const [selectedOrderType, setSelectedOrderType] = useState("Market Order");

  const [limitPrice, setLimitPrice] = useState(lastPrice);
  useEffect(() => {
    if (selectedOrderType === "Market Order") {
      setLimitPrice(lastPrice);
    }
  }, [lastPrice, selectedOrderType]);

  const priceType = selectedOrderType === "Market Order" ? "MKT" : "LMT";
 
  console.log(margin, "the narrrrrrrrrrrrrrrrr");
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
                "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIiwiaWF0IjoxNzM0MzI5MDIyLCJleHAiOjE3MzQzOTU0MDAsInN1YmplY3RfaWQiOiJLRTAwNzAiLCJwYXJ0bmVyX2NoYW5uZWwiOiJBUEkiLCJwYXJ0bmVyX2NvZGUiOiJLRTAwNzAiLCJ1c2VyX2lkIjoiS0UwMDcwIiwibGFzdF92YWxpZGF0ZWRfZGF0ZV90aW1lIjoxNzM0MzI5MDIyMjg2LCJpc3N1ZXJfaWQiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIn0.o3nNfvEBE46nbpxbjpSES7Mu-3WRu7MRTdfNJrTTIe4",
              "user-Id": "KE0070",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: "KE0070",
              exchange: selectedData.exchange,
              trading_symbol: selectedData.trading_symbol,
              price:
                selectedOrderType === "Market Order" ? lastPrice : limitPrice,
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

    console.log(fetchOrderMargin, "the order marginssssss");

    fetchOrderMargin();
  }, [
    lastPrice,
    quantity,
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
      <div className="flex items-center space-x-4 whitespace-nowrap">
        <BeetleBalance />
        {beetleCoins && (
          <div className="bg-white text-[#7D7D7D] border shadow-sm p-2 rounded-md">
            <span>Beetle Coins: {beetleCoins.amount}</span>
          </div>
        )}
      </div>
      <div className="bg-white text-black font-bold text-xl shadow-sm p-2 rounded-md">
        <span>{selectedData?.display_name || "No stock selected"}</span>
      </div>

      {/* <div className="flex items-center justify-between space-x-2">
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
      </div> */}

      {/* Delivery / Intraday Toggle */}
      <div className="flex w-full justify-between items-center mb-4 border p-2 rounded-md bg-white">
        <div className="flex w-full">
          <button
            className={`w-1/2 px-6 py-2 rounded-l-md ${
              productType === "Delivery"
                ? "bg-[#E8FCF1] text-green-500 border font-bold"
                : "bg-transparent text-[#7D7D7D] border"
            }`}
            // onClick={() => setIsDelivery(true)}
          >
            Delivery
          </button>
          <button
            className={`w-1/2 px-6 py-2 rounded-r-md ${
              productType === "Intraday"
                ? "bg-[#E8FCF1] text-blue-500 border font-bold"
                : "bg-transparent text-[#7D7D7D] border"
            }`}
            // onClick={() => setIsDelivery(false)}
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
