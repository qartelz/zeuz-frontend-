import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// WebSocket Context
const WebSocketContext = createContext();

// WebSocket Provider component to wrap your app
export const WebSocketProvider = ({ children }) => {
  const [lastPrice, setLastPrice] = useState("0.00");
  const [volume, setVolume] = useState("0.00");
  const [percentChange, setPercentChange] = useState("0.00");
  const wsRef = useRef(null);
  const touchlineTimerRef = useRef(null);

  const connectWebSocket = (touchline) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    const ws = new WebSocket("wss://orca-uatwss.enrichmoney.in/ws");
    wsRef.current = ws;

    const touchlineInterval = 5000; // 5 seconds

    ws.onopen = () => {
      console.log("WebSocket connected");

      const initialData = {
        t: "c",
        uid: "KE0070",
        actid: "KE0070",
        susertoken:
          "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIiwiaWF0IjoxNzM0MTcyNjMxLCJleHAiOjE3MzQyMjI2MDAsInN1YmplY3RfaWQiOiJLRTAwNzAiLCJwYXJ0bmVyX2NoYW5uZWwiOiJBUEkiLCJwYXJ0bmVyX2NvZGUiOiJLRTAwNzAiLCJ1c2VyX2lkIjoiS0UwMDcwIiwibGFzdF92YWxpZGF0ZWRfZGF0ZV90aW1lIjoxNzM0MTcyNjMxNzI0LCJpc3N1ZXJfaWQiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIn0.K2v9XnfeFnqPt0mNXvqUDlGpS6B5dap38IzuQt7vVfU",
        source: "API",
      };
      ws.send(JSON.stringify(initialData));

      touchlineTimerRef.current = setInterval(() => {
        ws.send(
          JSON.stringify({
            t: "t",
            k: touchline, // dynamic touchline passed from the component
          })
        );
      }, touchlineInterval);
    };

    ws.onmessage = (event) => {
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
  };

  useEffect(() => {
    return () => {
      if (touchlineTimerRef.current) {
        clearInterval(touchlineTimerRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ lastPrice, volume, percentChange, connectWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use WebSocket context in any component
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
