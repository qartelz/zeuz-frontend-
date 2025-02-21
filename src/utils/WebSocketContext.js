import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const wsRef = useRef(null);
  const [tokenPrices, setTokenPrices] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [dataReceived, setDataReceived] = useState(false);
  const [broadcastToken, setBroadcastToken] = useState(null);
  const [lastMessage, setLastMessage] = useState(null); 

  useEffect(() => {
    const checkAuthData = () => {
      const authDataString = localStorage.getItem("authData");
      const authData = authDataString ? JSON.parse(authDataString) : null;
      const token = authData?.broadcast_token;
      
      if (token) {
        setBroadcastToken(token);
        // console.log("Broadcast token updated:", token);
      } else {
        console.log("No broadcast token found");
      }
    };

    checkAuthData();
    const intervalId = setInterval(checkAuthData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const initialData = {
    t: "c",
    uid: "KE0070",
    actid: "KE0070",
    susertoken: broadcastToken,
    source: "API",
  };

  const connectWebSocket = () => {
    if (!broadcastToken) return;

    const ws = new WebSocket("wss://orca-uatwss.enrichmoney.in/ws");
    wsRef.current = ws;

    console.log("Attempting to connect WebSocket...");

    const heartbeatInterval = 60000;
    let heartbeatTimer;

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(JSON.stringify(initialData));
      setIsConnected(true);
      setDataReceived(false);

      heartbeatTimer = setInterval(() => {
        const heartbeatMessage = { t: "h" };
        ws.send(JSON.stringify(heartbeatMessage));
        console.log("Heartbeat sent:", heartbeatMessage);
      }, heartbeatInterval);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message received:", data);
      setLastMessage(data);
      try {
        const data = JSON.parse(event.data);
        console.log("Parsed data:", data);
        if (data.t === 'tk' && data.tk) {
          const key = `${data.e}|${data.tk}`;
          setTokenPrices((prev) => ({
            ...prev,
            [key]: {
              lastPrice: data.lp || '0.00',
              volume: data.v || '0.00',
              percentChange: data.pc || '0.00',
            },
          }));
          setDataReceived(true); // Mark that data has been received
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      clearInterval(heartbeatTimer);
      setDataReceived(false);
      console.log("Attempting to reconnect in 3 seconds...");
      setTimeout(connectWebSocket, 3000);
    };
  };

  useEffect(() => {
    if (broadcastToken) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        console.log("WebSocket connection closed");
      }
    };
  }, [broadcastToken]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!dataReceived && isConnected) {
        console.log("No data received, sending initial request again...");
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify(initialData));
        }
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [dataReceived, isConnected]);

  const sendTouchlineRequest = (touchline) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          t: "t",
          k: touchline,
        })
      );
      // console.log("Touchline request sent:", touchline);
    } else {
      console.warn("Cannot send touchline request, WebSocket is not open");
    }
  };

  return (
    <WebSocketContext.Provider value={{ 
      tokenPrices, 
      sendTouchlineRequest, 
      isConnected,
      broadcastToken // Expose broadcast token status if needed
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
