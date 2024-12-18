import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketTradeContext = createContext(null);

export const WebSocketTrade = ({ children,touchline }) => {
  const [lastPrice, setLastPrice] = useState( "0.00");
  const [volume, setVolume] = useState("0.00");
  const [percentChange, setPercentChange] = useState("0.00");

  const authDataString = localStorage.getItem("authData");
  const authData = authDataString ? JSON.parse(authDataString) : null;
  const broadcast_token= authData?.broadcast_token;

  useEffect(() => {
    const heartbeatInterval = 60000; 
    const touchlineInterval = 5000; 
    let heartbeatTimer;
    let touchlineTimer;
    const ws = new WebSocket("wss://orca-uatwss.enrichmoney.in/ws"); 

    ws.onopen = () => {
      console.log("WebSocket connected of trade");

      const initialData = {
        t: "c",
        uid: "KE0070",
        actid: "KE0070",
        susertoken: "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIiwiaWF0IjoxNzM0NTAwNjkwLCJleHAiOjE3MzQ1NjgyMDAsInN1YmplY3RfaWQiOiJLRTAwNzAiLCJwYXJ0bmVyX2NoYW5uZWwiOiJBUEkiLCJwYXJ0bmVyX2NvZGUiOiJLRTAwNzAiLCJ1c2VyX2lkIjoiS0UwMDcwIiwibGFzdF92YWxpZGF0ZWRfZGF0ZV90aW1lIjoxNzM0NTAwNjkwNTcwLCJpc3N1ZXJfaWQiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIn0.C5e-pxvXlpFWmF6vzFbRvOqrNI1BfoMrLeQGUA1ftMI",
        source: "API",
      };

      ws.send(JSON.stringify(initialData));

      // Setup heartbeat
      heartbeatTimer = setInterval(() => {
        const heartbeatMessage = { t: "h" };
        console.log("Sending heartbeat message:", heartbeatMessage);
        ws.send(JSON.stringify(heartbeatMessage));
      }, heartbeatInterval);

   
      if (ws ) {
        touchlineTimer = setInterval(() => {
          ws.send(
            JSON.stringify({
              t: "t",
              k: touchline, 
            })
          );
        }, touchlineInterval);
      }
    };
    console.log(touchline)

    ws.onmessage = async (event) => {
      console.log("Received message:", event.data); // Log the raw message

      try {
        const data = JSON.parse(event.data);

        if (data.lp) {
          setLastPrice(data.lp);
        }
        if (data.v) setVolume(data.v);
        if (data.pc) setPercentChange(data.pc);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
       
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    
    return () => {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      if (touchlineTimer) clearInterval(touchlineTimer);
      ws.close();
    };
  }, [touchline]); 

 
  

  return (
    <WebSocketTradeContext.Provider
      value={{ lastPrice, volume, percentChange }}
    >
      {children}
    </WebSocketTradeContext.Provider>
  );
};

export const useWebSocketTrade = () => useContext(WebSocketTradeContext);
