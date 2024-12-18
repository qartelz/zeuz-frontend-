// // src/context/WebSocketContext.js

// import React, { createContext, useContext, useEffect, useRef, useState } from "react";

// const WebSocketContext = createContext();

// export const WebSocketProvider = ({ children }) => {
//   const wsRef = useRef(null);
//   const touchlineTimerRef = useRef(null);
//   const [lastPrice, setLastPrice] = useState("0.00");
//   const [volume, setVolume] = useState("0.00");
//   const [percentChange, setPercentChange] = useState("0.00");

//   const initialData = {
//     t: "c",
//     uid: "KE0070",
//     actid: "KE0070",
//     susertoken:
//       "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIiwiaWF0IjoxNzM0NTAwNjkwLCJleHAiOjE3MzQ1NjgyMDAsInN1YmplY3RfaWQiOiJLRTAwNzAiLCJwYXJ0bmVyX2NoYW5uZWwiOiJBUEkiLCJwYXJ0bmVyX2NvZGUiOiJLRTAwNzAiLCJ1c2VyX2lkIjoiS0UwMDcwIiwibGFzdF92YWxpZGF0ZWRfZGF0ZV90aW1lIjoxNzM0NTAwNjkwNTcwLCJpc3N1ZXJfaWQiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIn0.C5e-pxvXlpFWmF6vzFbRvOqrNI1BfoMrLeQGUA1ftMI",
//     source: "API",
//   };

//   useEffect(() => {
//     const ws = new WebSocket("wss://orca-uatwss.enrichmoney.in/ws");
//     wsRef.current = ws;

//     const touchlineInterval = 5000; // 5 seconds
//     const heartbeatInterval = 60000; // 60 seconds
//     let heartbeatTimer;

//     ws.onopen = () => {
//       ws.send(JSON.stringify(initialData));
//       console.log("WebSocket connected");
      


//       // Send heartbeat messages
//       heartbeatTimer = setInterval(() => {
//         const heartbeatMessage = { t: "h" };
//         ws.send(JSON.stringify(heartbeatMessage));
//       }, heartbeatInterval);
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.lp) setLastPrice(data.lp);
//         if (data.v) setVolume(data.v);
//         if (data.pc) setPercentChange(data.pc);
//         console.log("Received data from WebSocket:", data);
//       } catch (error) {
//         console.error("Error parsing WebSocket message:", error);
//       }
//     };

//     ws.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     ws.onclose = () => {
//       console.log("WebSocket disconnected");
//       if (heartbeatTimer) clearInterval(heartbeatTimer);
//     };

//     return () => {
//       clearInterval(touchlineTimerRef.current);
//       ws.close();
//     };
//   }, []);

//   const sendTouchlineRequest = (touchline) => {
//     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//       wsRef.current.send(
//         JSON.stringify({
//           t: "t",
//           k: touchline,
//         })
        
//       );
//     }
//     console.log("WebSocket connected with", touchline);
//   };

//   return (
//     <WebSocketContext.Provider
//       value={{
//         lastPrice,
//         volume,
//         percentChange,
//         sendTouchlineRequest,
//       }}
//     >
//       {children}
//     </WebSocketContext.Provider>
//   );
// };

// export const useWebSocket = () => useContext(WebSocketContext);


import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const wsRef = useRef(null);
   const touchlineTimerRef = useRef(null);
  const [tokenPrices, setTokenPrices] = useState({});

  const initialData = {
    t: "c",
    uid: "KE0070",
    actid: "KE0070",
    susertoken: 
      "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIiwiaWF0IjoxNzM0NTAwNjkwLCJleHAiOjE3MzQ1NjgyMDAsInN1YmplY3RfaWQiOiJLRTAwNzAiLCJwYXJ0bmVyX2NoYW5uZWwiOiJBUEkiLCJwYXJ0bmVyX2NvZGUiOiJLRTAwNzAiLCJ1c2VyX2lkIjoiS0UwMDcwIiwibGFzdF92YWxpZGF0ZWRfZGF0ZV90aW1lIjoxNzM0NTAwNjkwNTcwLCJpc3N1ZXJfaWQiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIn0.C5e-pxvXlpFWmF6vzFbRvOqrNI1BfoMrLeQGUA1ftMI",
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
        
        console.log("Received data from WebSocket:", data);
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
    console.log("WebSocket request sent for", touchline);
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
