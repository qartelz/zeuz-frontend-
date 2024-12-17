// WebSocketContext.js
import React, { createContext, useReducer, useContext, useEffect, useRef } from 'react';

const WebSocketStateContext = createContext();
const WebSocketDispatchContext = createContext();

const initialState = {
  lastPrice: "0.00",
  volume: "0.00",
  percentChange: "0.00",
  touchline: "",  // Add touchline to state
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LAST_PRICE':
      return { ...state, lastPrice: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_PERCENT_CHANGE':
      return { ...state, percentChange: action.payload };
    case 'SET_TOUCHLINE':  // Handle touchline update
      return { ...state, touchline: action.payload };
    default:
      return state;
  }
};

export const WebSocketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const wsRef = useRef(null);
  const touchlineTimerRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("wss://orca-uatwss.enrichmoney.in/ws");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");

      const initialData = {
        t: "c",
        uid: "KE0070",
        actid: "KE0070",
        susertoken:
          "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIiwiaWF0IjoxNzM0NDExODg4LCJleHAiOjE3MzQ0ODE4MDAsInN1YmplY3RfaWQiOiJLRTAwNzAiLCJwYXJ0bmVyX2NoYW5uZWwiOiJBUEkiLCJwYXJ0bmVyX2NvZGUiOiJLRTAwNzAiLCJ1c2VyX2lkIjoiS0UwMDcwIiwibGFzdF92YWxpZGF0ZWRfZGF0ZV90aW1lIjoxNzM0NDExODg4NTk3LCJpc3N1ZXJfaWQiOiJodHRwczovL3Nzby5lbnJpY2htb25leS5pbi9vcmcvaXNzdWVyIn0.GfyW9rGbHQgpPvUps8kPHBk4qMWm0IoxdF4BnDAJ4h4", // Replace with dynamic or environment-based token
        source: "API",
      };
      ws.send(JSON.stringify(initialData));

      const heartbeatInterval = 60000; // 60 seconds

      setInterval(() => {
        const heartbeatMessage = { t: "h" };
        ws.send(JSON.stringify(heartbeatMessage));
      }, heartbeatInterval);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.lp) {
        dispatch({ type: 'SET_LAST_PRICE', payload: data.lp });
      }
      if (data.v) {
        dispatch({ type: 'SET_VOLUME', payload: data.v });
      }
      if (data.pc) {
        dispatch({ type: 'SET_PERCENT_CHANGE', payload: data.pc });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          t: "t",
          k: state.touchline,  // Send updated touchline
        })
      );

      if (touchlineTimerRef.current) {
        clearInterval(touchlineTimerRef.current);
      }

      const touchlineInterval = 5000; // 5 seconds
      touchlineTimerRef.current = setInterval(() => {
        wsRef.current.send(
          JSON.stringify({
            t: "t",
            k: state.touchline, // dynamic touchline
          })
        );
      }, touchlineInterval);
    }
  }, [state.touchline]);

  return (
    <WebSocketStateContext.Provider value={state}>
      <WebSocketDispatchContext.Provider value={dispatch}>
        {children}
      </WebSocketDispatchContext.Provider>
    </WebSocketStateContext.Provider>
  );
};

export const useWebSocketState = () => {
  const context = useContext(WebSocketStateContext);
  if (context === undefined) {
    throw new Error('useWebSocketState must be used within a WebSocketProvider');
  }
  return context;
};

export const useWebSocketDispatch = () => {
  const context = useContext(WebSocketDispatchContext);
  if (context === undefined) {
    throw new Error('useWebSocketDispatch must be used within a WebSocketProvider');
  }
  return context;
};
