// src/services/ConnectionService.js
export class ConnectionService {
  constructor(onMessage, onStatusChange) {
    this.peer = null;
    this.connection = null;
    this.onMessage = onMessage;
    this.onStatusChange = onStatusChange;
    this.isHost = false;
  }

  async loadPeerJS() {
    if (window.Peer) return;
    
    const cdnUrls = [
      'https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.4.7/peerjs.min.js',
      'https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js'
    ];
    
    for (const url of cdnUrls) {
      try {
        await this.loadScript(url);
        if (window.Peer) return;
      } catch (error) {
        console.warn('Failed to load from:', url);
        continue;
      }
    }
    
    throw new Error('Failed to load PeerJS library');
  }

  loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => setTimeout(resolve, 100);
      script.onerror = reject;
      document.head.appendChild(script);
      
      setTimeout(() => {
        if (!window.Peer) reject(new Error('Script load timeout'));
      }, 10000);
    });
  }

  async hostGame(gameCode) {
    try {
      await this.loadPeerJS();
      this.onStatusChange('Creating game room...', 'loading');
      this.isHost = true;
      
      this.peer = new Peer(gameCode, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        },
        debug: 2
      });

      const timeout = setTimeout(() => {
        if (this.peer && !this.peer.open) {
          this.peer.destroy();
          this.onStatusChange('Connection timeout. Try again.', 'error');
        }
      }, 15000);

      this.peer.on('open', (id) => {
        clearTimeout(timeout);
        console.log('Peer opened with ID:', id);
        this.onStatusChange('Game room created! Share the code with your friend.', 'success');
      });

      this.peer.on('connection', (conn) => {
        console.log('Incoming connection:', conn);
        this.connection = conn;
        this.setupConnection();
        this.onStatusChange('Player connected! Starting game...', 'success');
      });

      this.peer.on('error', (err) => {
        clearTimeout(timeout);
        console.error('Peer error:', err);
        this.onStatusChange(`WebRTC error: ${err.type || 'Connection failed'}`, 'error');
      });

    } catch (error) {
      console.error('Host game error:', error);
      this.onStatusChange('Failed to create room: ' + error.message, 'error');
    }
  }

  async joinGame(gameCode) {
    try {
      await this.loadPeerJS();
      this.onStatusChange('Connecting to game...', 'loading');
      this.isHost = false;

      this.peer = new Peer(undefined, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        },
        debug: 2
      });

      const timeout = setTimeout(() => {
        if (this.peer && !this.peer.open) {
          this.peer.destroy();
          this.onStatusChange('Connection timeout. Check the code.', 'error');
        }
      }, 15000);
      
      this.peer.on('open', (id) => {
        clearTimeout(timeout);
        console.log('Peer opened with ID:', id, 'connecting to:', gameCode);
        this.connection = this.peer.connect(gameCode, { reliable: true });
        this.setupConnection();
      });

      this.peer.on('error', (err) => {
        clearTimeout(timeout);
        console.error('Join error:', err);
        this.onStatusChange(`Failed to connect: ${err.type || 'Check the code'}`, 'error');
      });

    } catch (error) {
      console.error('Join game error:', error);
      this.onStatusChange('Failed to join: ' + error.message, 'error');
    }
  }

  setupConnection() {
    if (!this.connection) return;

    console.log('Setting up connection...');

    this.connection.on('open', () => {
      console.log('Connection opened successfully');
      this.onStatusChange('Connected! Starting game...', 'success');
      
      // Exchange player info immediately
      if (this.onMessage) {
        // Small delay to ensure both sides are ready
        setTimeout(() => {
          this.onMessage({ type: 'connectionReady' });
        }, 500);
      }
    });

    this.connection.on('data', (data) => {
      console.log('Received data:', data);
      if (this.onMessage) {
        this.onMessage(data);
      }
    });

    this.connection.on('close', () => {
      console.log('Connection closed');
      this.onStatusChange('Connection lost', 'error');
    });

    this.connection.on('error', (err) => {
      console.error('Connection error:', err);
      this.onStatusChange('Connection error: ' + err.message, 'error');
    });
  }

  sendMessage(message) {
    if (this.connection && this.connection.open) {
      console.log('Sending message:', message);
      this.connection.send(message);
      return true;
    }
    console.warn('Cannot send message - connection not ready');
    return false;
  }

  disconnect() {
    console.log('Disconnecting...');
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.connection = null;
    this.isHost = false;
  }
}
