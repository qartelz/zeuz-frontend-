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

  const initialData = {
    t: "c",
    uid: "KE0070",
    actid: "KE0070",
    susertoken: 
    `${broadcast_token}`,
    source: "API",
  };

  useEffect(() => {
    const ws = new WebSocket("wss://orca-uatwss.enrichmoney.in/ws");
    wsRef.current = ws;

    const heartbeatInterval = 60000;
    
    let heartbeatTimer;

    ws.onopen = () => {
      ws.send(JSON.stringify(initialData));
      console.log("WebSocket connected");

    
      heartbeatTimer = setInterval(() => {
        const heartbeatMessage = { t: "h" };
        ws.send(JSON.stringify(heartbeatMessage));
      }, heartbeatInterval);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        
        if (data.t === 'tk' && data.tk) {
         
          const key = `${data.e}|${data.tk}`;
          
      
          setTokenPrices(prev => ({
            ...prev,
            [key]: {
              lastPrice: data.lp || '0.00',
              volume: data.v || '0.00',
              percentChange: data.pc || '0.00'
            }
          }));
        }
        
        // console.log("Received data from WebSocket:", data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      if (heartbeatTimer) clearInterval(heartbeatTimer);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendTouchlineRequest = (touchline) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          t: "t",
          k: touchline,
        })
      );
    }
    // console.log("WebSocket request sent for", touchline);
  };

  return (
    <WebSocketContext.Provider
      value={{
        tokenPrices,
        sendTouchlineRequest,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
