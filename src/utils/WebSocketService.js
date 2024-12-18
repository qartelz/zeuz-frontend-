// src/utils/WebSocketService.js

class WebSocketService {
    constructor(url) {
      this.url = url;
      this.socket = null;
      this.listeners = {};
      this.heartbeatInterval = null;
      this.reconnectDelay = 1000; // Reconnection delay in ms
    }
  
    connect() {
      this.socket = new WebSocket(this.url);
  
      this.socket.onopen = () => {
        console.log("WebSocket connected.");
        this.startHeartbeat();
      };
  
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const touchline = data.touchline;
  
        if (this.listeners[touchline]) {
          this.listeners[touchline].forEach((callback) => callback(data));
        }
      };
  
      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
  
      this.socket.onclose = () => {
        console.warn("WebSocket disconnected.");
        this.stopHeartbeat();
        setTimeout(() => this.connect(), this.reconnectDelay);
      };
    }
  
    startHeartbeat() {
      this.heartbeatInterval = setInterval(() => {
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: "heartbeat" }));
        }
      }, 5000); // Heartbeat every 5 seconds
    }
  
    stopHeartbeat() {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
    }
  
    subscribe(touchline, callback) {
      if (!this.listeners[touchline]) {
        this.listeners[touchline] = [];
      }
      this.listeners[touchline].push(callback);
    }
  
    unsubscribe(touchline, callback) {
      if (this.listeners[touchline]) {
        this.listeners[touchline] = this.listeners[touchline].filter(
          (cb) => cb !== callback
        );
        if (this.listeners[touchline].length === 0) {
          delete this.listeners[touchline];
        }
      }
    }
  }
  
  const instance = new WebSocketService("wss://orca-uatwss.enrichmoney.in/ws");
  export default instance;
  