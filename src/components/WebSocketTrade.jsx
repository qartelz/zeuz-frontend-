import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketTradeContext = createContext(null);

export const WebSocketTrade = ({ children, selectedTrade }) => {
  const [lastPrice, setLastPrice] = useState(selectedTrade?.strike_price || "0.00");
  const [volume, setVolume] = useState("0.00");
  const [percentChange, setPercentChange] = useState("0.00");

  useEffect(() => {
    const heartbeatInterval = 60000; // 60 seconds
    const touchlineInterval = 5000; // 5 seconds
    let heartbeatTimer;
    let touchlineTimer;
    const ws = new WebSocket("wss://orca-uatwss.enrichmoney.in/ws"); // Use environment variable

    ws.onopen = () => {
      console.log("WebSocket connected");

      const initialData = {
        t: "c",
        uid: "KE0070",
        actid: "KE0070",
        susertoken: "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIiwiaWF0IjoxNzMyNjAyNTM3LCJleHAiOjE3MzI2ODcyMDAsInN1YmplY3RfaWQiOiJLRTAwNzAiLCJwYXJ0bmVyX2NoYW5uZWwiOiJBUEkiLCJwYXJ0bmVyX2NvZGUiOiJLRTAwNzAiLCJ1c2VyX2lkIjoiS0UwMDcwIiwibGFzdF92YWxpZGF0ZWRfZGF0ZV90aW1lIjoxNzMyNjAyNTM3OTYzLCJpc3N1ZXJfaWQiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIn0.a0Y4uwhBsDC4TWTgrTlcbIaD9C-1bMcZQ5ebSPtCLB4", // Use environment variable
        source: "API",
      };

      ws.send(JSON.stringify(initialData));

      // Setup heartbeat
      heartbeatTimer = setInterval(() => {
        const heartbeatMessage = { t: "h" };
        console.log("Sending heartbeat message:", heartbeatMessage);
        ws.send(JSON.stringify(heartbeatMessage));
      }, heartbeatInterval);

      // Setup touchline
      if (selectedTrade) {
        touchlineTimer = setInterval(() => {
          ws.send(
            JSON.stringify({
              t: "t",
              k: `${selectedTrade.exchange}|${selectedTrade.token_id}`,
            })
          );
        }, touchlineInterval);
      }
    };

    ws.onmessage = (event) => {
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
        // Optionally, handle non-JSON messages here
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Cleanup on unmount or when selectedTrade changes
    return () => {
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      if (touchlineTimer) clearInterval(touchlineTimer);
      ws.close();
    };
  }, [selectedTrade]); // Consider if dependency on selectedTrade is necessary

  // Update lastPrice when selectedTrade changes
  useEffect(() => {
    if (selectedTrade?.strike_price) {
      setLastPrice(selectedTrade.strike_price);
    }
  }, [selectedTrade]);

  return (
    <WebSocketTradeContext.Provider
      value={{ lastPrice, volume, percentChange }}
    >
      {children}
    </WebSocketTradeContext.Provider>
  );
};

export const useWebSocketTrade = () => useContext(WebSocketTradeContext);
