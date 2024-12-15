import { useEffect, useState, useRef } from 'react';

const useWebSocketManager = (touchline) => {
  const [lastPrice, setLastPrice] = useState("0.00");
  const [volume, setVolume] = useState("0.00");
  const [percentChange, setPercentChange] = useState("0.00");
  const wsRef = useRef(null);
  const touchlineTimerRef = useRef(null);

  useEffect(() => {
    // If WebSocket is already open, return early
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    const ws = new WebSocket("wss://orca-uatwss.enrichmoney.in/ws");
    wsRef.current = ws;
    
    const touchlineInterval = 5000; // 5 seconds
    const heartbeatInterval = 60000; // 60 seconds
    let heartbeatTimer;

    ws.onopen = () => {
      console.log("WebSocket connected");

      const initialData = {
        t: "c",
        uid: "KE0070",
        actid: "KE0070",
        susertoken:
          "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIiwiaWF0IjoxNzM0MjUwOTY2LCJleHAiOjE3MzQzMDkwMDAsInN1YmplY3RfaWQiOiJLRTAwNzAiLCJwYXJ0bmVyX2NoYW5uZWwiOiJBUEkiLCJwYXJ0bmVyX2NvZGUiOiJLRTAwNzAiLCJ1c2VyX2lkIjoiS0UwMDcwIiwibGFzdF92YWxpZGF0ZWRfZGF0ZV90aW1lIjoxNzM0MjUwOTY2NDMzLCJpc3N1ZXJfaWQiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIn0.ofBhYQO0tCfkhN3yfW7kNHLp9EMHkSZarFVRXpGkLvw", // Replace with dynamic or environment-based token
        source: "API",
      };
      ws.send(JSON.stringify(initialData));

      heartbeatTimer = setInterval(() => {
        const heartbeatMessage = { t: "h" };
        console.log("Sending heartbeat message:", heartbeatMessage);
        ws.send(JSON.stringify(heartbeatMessage));
      }, heartbeatInterval);

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

    return () => {
     
      clearInterval(touchlineTimerRef.current);
      if (heartbeatTimer) clearInterval(heartbeatTimer);
    
      ws.close();
    };
  }, [touchline]);

  return { lastPrice, volume, percentChange };
};

export default useWebSocketManager;
