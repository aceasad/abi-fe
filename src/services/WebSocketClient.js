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
  }

  connect = (path, onopen = () => {}, onmessage = () => {}) => {
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = onopen;
    this.socketRef.onmessage = onmessage;
    this.socketRef.onclose = () => {
      if (this.isComponentMounted) this.connect(path, onopen, onmessage);
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

  closeConnection = () => this.socketRef.close();

  sendMessage = (message) => this.socketRef.send(message);

  isConnected = () => this.state() === 1;
}

export default WebSocketClient.getInstance();
