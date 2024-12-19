import React, { useEffect, useMemo, useState } from "react";
import { useWebSocket } from "../utils/WebSocketContext.js";

const StockInfo = ({ selectedData }) => {
 
  const { tokenPrices, sendTouchlineRequest } = useWebSocket();

  const touchline = useMemo(
    () => `${selectedData.exchange}|${selectedData.token_id}`,
    [selectedData.exchange, selectedData.token_id]
  );

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
    tokenData.lastPrice,
    sendTouchlineRequest,
    tokenData.tokenData,
    connectionAttempts,
  ]);
  


  const data = [
    { value: `${tokenData.percentChange}%`, label: "24h Change" },
    // { value: "+1.25%", label: "24h High" },
    // { value: "+1.25%", label: "24h Low" },
    { value: tokenData.volume, label: "Market Volume" },
  ];

  return (
    <div className="p-2 mt-6  md:mt-0 md:p-4 bg-white border rounded-md flex justify-between items-center space-x-4">
      <div >
        <div className="flex text-sm md:text-lg items-center space-x-2 cursor-pointer whitespace-nowrap">
          <span className="font-bold ">{selectedData?.display_name}</span>
        </div>
      </div>

      <div className="h-10 w-px bg-gray-500 mx-4 hidden md:block" />

      <div className="flex text-xs md:text-lg flex-wrap items-center space-x-4 space-y-2">
        <div className="text-left whitespace-nowrap">
          <p className=" font-bold">{tokenData.lastPrice}</p>
          <p className=" text-gray-400">Last Traded Price</p>
        </div>
      </div>

      <div className="h-10 w-px text-xs md:text-lg bg-gray-500 mx-4 hidden md:block" />

      <div className="flex text-xs md:text-lg space-x-2 md:space-x-9">
        {data.map((item, index) => (
          <div key={index} className="text-center whitespace-nowrap">
            <p
              className={` font-semibold ${
                item.label === "24h Change"
                  ? parseFloat(item.value) > 0
                    ? "text-green-500"
                    : parseFloat(item.value) < 0
                    ? "text-red-500"
                    : "text-gray-500"
                  : ""
              }`}
            >
              {item.value}
            </p>

            <p className="text-xs md:text-lg text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockInfo;
