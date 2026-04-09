class WebSocketClient {
  static instance = null;

  static getInstance() {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  constructor() {
    this.socketRef = null;
    this.isComponentMounted = false;
    this.reconnectTimer = null;
    this.currentPath = null;
  }

  connect = (path, onopen = () => {}, onmessage = () => {}) => {
    // Prevent overlapping sockets in one browser session.
    if (
      this.socketRef &&
      (this.socketRef.readyState === WebSocket.OPEN ||
        this.socketRef.readyState === WebSocket.CONNECTING)
    ) {
      this.closeConnection();
    }

    this.currentPath = path;
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = onopen;
    this.socketRef.onmessage = onmessage;
    this.socketRef.onclose = () => {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
      }
      if (this.isComponentMounted) {
        this.reconnectTimer = setTimeout(() => {
          this.connect(path, onopen, onmessage);
        }, 500);
      }
    };
  };

  state = () => this.socketRef && this.socketRef.readyState;

  waitForConnection = () => {
    const interval = setInterval(() => {
      if (this.state() === 1) {
        clearInterval(interval);
      }
    }, 500);
  };

  closeConnection = () => {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socketRef) {
      this.socketRef.onclose = null;
      if (
        this.socketRef.readyState === WebSocket.OPEN ||
        this.socketRef.readyState === WebSocket.CONNECTING
      ) {
        this.socketRef.close();
      }
    }
    this.socketRef = null;
  };

  sendMessage = (message) => this.socketRef.send(message);

  isConnected = () => this.state() === 1;
}

export default WebSocketClient.getInstance();
