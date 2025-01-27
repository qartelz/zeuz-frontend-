import React, { useEffect, useMemo, useState } from "react";
import { useWebSocket } from "../utils/WebSocketContext";
import { TrendingDown, TrendingUp } from "lucide-react";

const CardRow = () => {
  const { tokenPrices, sendTouchlineRequest } = useWebSocket();

  const keysToDisplay = [
    "NSE|Nifty50",
    "NSE|NiftyBank",
    "NSE|NiftyIT",
    "NSE|NiftyFMCG",
    "NSE|NiftyMetal",
    "NSE|NiftyAuto",
    "NSE|NiftyPharma",
    "NSE|NiftyPSUBank0,NSE|NiftyPSE",
    "NSE|NiftyFinService",
  ];
  

  const filteredTokenPrices = useMemo(() => {
    return Object.fromEntries(
      Object.entries(tokenPrices).filter(([key]) => keysToDisplay.includes(key))
    );
  }, [tokenPrices]);
  const [loading, setLoading] = useState(true);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  useEffect(() => {
    keysToDisplay.forEach((key) => sendTouchlineRequest(key));

    const loadingTimeout = setTimeout(() => {
      const hasData = keysToDisplay.every(
        (key) => tokenPrices[key]?.lastPrice && tokenPrices[key]?.lastPrice !== "0.00"
      );
      setLoading(!hasData);
    }, 100000);

    return () => clearTimeout(loadingTimeout);

  }, [sendTouchlineRequest, keysToDisplay]);


  useEffect(() => {
    const checkDataTimer = setInterval(() => {
      keysToDisplay.forEach((key) => {
        if (tokenPrices[key]?.lastPrice === "0.00") {
          sendTouchlineRequest(key);
          setConnectionAttempts((prev) => prev + 1);
          // console.log(
          //   `Retry touchline request for ${key}. Attempt: ${
          //     connectionAttempts + 1
          //   }`
          // );
        }
      });
    }, 100000);

    return () => clearInterval(checkDataTimer);
  }, [keysToDisplay, sendTouchlineRequest, tokenPrices, connectionAttempts]);

  return (
    <div className="flex items-center  justify-center flex-nowrap gap-2 p-2">
      
      {Object.entries(filteredTokenPrices).map(
        ([key, { lastPrice, percentChange }]) => (
          <div
            key={key}
            className="bg-white hover:scale-105 shadow-md whitespace-nowrap overflow-hidden rounded-md  px-4 py-1 w-full sm:w-1/2 lg:w-[180px] flex justify-between items-center"
          >
            <div>
              <h3 className="font-light font-poppins text-[#0E8190] text-md ">
                {key.includes("|")
                  ? key.split("|")[1].replace(/([a-z])([A-Z0-9])/g, "$1 $2")
                  : key.replace(/([a-z])([A-Z0-9])/g, "$1 $2")}
              </h3>

              <p>
                <strong className="font-poppins text-sm">
                  {new Intl.NumberFormat("en-IN").format(lastPrice)}
                </strong>
              </p>
              <p
                className={`font-poppins font-bold text-sm ${
                  parseFloat(percentChange) >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {percentChange}%
              </p>
            </div>
            <div className="flex items-center">
              <p
                className={`font-bold ${
                  parseFloat(percentChange) >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              ></p>
              {parseFloat(percentChange) >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CardRow;