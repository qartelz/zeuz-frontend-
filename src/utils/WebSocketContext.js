import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const WebSocketContext = createContext();
const authDataString = localStorage.getItem("authData");
const authData = authDataString ? JSON.parse(authDataString) : null;
const accessToken = authData?.access;
const user_id = authData?.user_id;
const broadcast_token = authData?.broadcast_token;
const broadcast_userid = authData?.broadcast_userid;

export const WebSocketProvider = ({ children }) => {
  const wsRef = useRef(null);
  const [tokenPrices, setTokenPrices] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [dataReceived, setDataReceived] = useState(false);

  const initialData = {
    t: "c",
    uid: "KE0070",
    actid: "KE0070",
    susertoken: `${broadcast_token}`,
    source: "API",
  };

  const connectWebSocket = () => {
    const ws = new WebSocket("wss://orca-uatwss.enrichmoney.in/ws");
    wsRef.current = ws;

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
        console.log(heartbeatMessage, "heartbeat");
      }, heartbeatInterval);
    };

    ws.onmessage = (event) => {
      console.log("Message received:", event.data);
      try {
        const data = JSON.parse(event.data);
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
      // Attempt to reconnect after a delay
      setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!dataReceived && isConnected) {
        console.log("No data received, sending initial request again...");
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify(initialData));
        }
      }
    }, 10000); // Adjust the timeout duration as needed

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
    }
  };

  return (
    <WebSocketContext.Provider value={{ tokenPrices, sendTouchlineRequest, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
