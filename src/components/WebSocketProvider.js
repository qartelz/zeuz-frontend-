import React, { useEffect } from "react";

import { useDispatch } from "react-redux";
import { initWebSocket } from "../redux/webSocketSlice";

const WebSocketProvider = ({ touchline, children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    initWebSocket(dispatch, touchline);
  }, [dispatch, touchline]);

  return <>{children}</>;
};

export default WebSocketProvider;
