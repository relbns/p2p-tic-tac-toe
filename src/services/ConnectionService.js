// src/services/ConnectionService.js - Improved for Cellular Networks
export class ConnectionService {
  constructor (onMessage, onStatusChange) {
    this.peer = null;
    this.connection = null;
    this.onMessage = onMessage;
    this.onStatusChange = onStatusChange;
    this.isHost = false;
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxConnectionAttempts = 3;
  }

  async loadPeerJS () {
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

  loadScript (url) {
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

  // Enhanced ICE servers for better cellular support
  getICEServers () {
    return [
      // Multiple STUN servers for redundancy
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      { urls: 'stun:global.stun.twilio.com:3478' },
      { urls: 'stun:stun.twilio.com:3478' },

      // TURN servers for cellular networks
      {
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject'
      },
      {
        urls: 'turn:openrelay.metered.ca:443',
        username: 'openrelayproject',
        credential: 'openrelayproject'
      },
      {
        urls: 'turn:openrelay.metered.ca:443?transport=tcp',
        username: 'openrelayproject',
        credential: 'openrelayproject'
      },
      // Additional TURN server
      {
        urls: 'turn:relay1.expressturn.com:3478',
        username: 'ef3GSRE4ZAvuwf1709',
        credential: 'Pai2OhWaWdm2naKc'
      }
    ];
  }

  // Enhanced peer configuration for cellular networks
  getPeerConfig () {
    return {
      config: {
        iceServers: this.getICEServers(),
        iceTransportPolicy: 'all', // Allow both UDP and TCP
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require',
        iceCandidatePoolSize: 10 // Pre-gather ICE candidates
      },
      debug: 1
    };
  }

  async hostGame (gameCode) {
    try {
      await this.loadPeerJS();
      this.onStatusChange('Creating game room...', 'loading');
      this.isHost = true;
      this.connectionAttempts = 0;

      await this.createPeer(gameCode);

    } catch (error) {
      console.error('Host game error:', error);
      this.onStatusChange('Failed to create room: ' + error.message, 'error');
    }
  }

  async createPeer (gameCode) {
    return new Promise((resolve, reject) => {
      this.peer = new Peer(gameCode, this.getPeerConfig());

      // Longer timeout for cellular networks
      const timeout = setTimeout(() => {
        if (this.peer && !this.peer.open) {
          this.peer.destroy();
          reject(new Error('Connection timeout. Try again.'));
        }
      }, 30000); // 30 seconds

      this.peer.on('open', (id) => {
        clearTimeout(timeout);
        console.log('Host peer opened with ID:', id);
        this.onStatusChange('Game room created! Share the code with your friend.', 'success');
        resolve(id);
      });

      this.peer.on('connection', (conn) => {
        if (this.connection && this.connection.open) {
          console.warn(`Host: Ignoring incoming connection from ${conn.peer}. Already connected to ${this.connection.peer}.`);
          conn.close();
          return;
        }

        console.log('Host: Incoming connection from:', conn.peer);

        if (this.connection) {
          console.warn(`Host: Closing previous connection from ${this.connection.peer} to accept new one from ${conn.peer}.`);
          this.connection.close();
        }

        this.connection = conn;
        this.setupConnection();
        this.onStatusChange('Player connecting...', 'loading');
      });

      this.peer.on('error', (err) => {
        clearTimeout(timeout);
        console.error('Host peer error:', err);

        // Retry logic for cellular networks
        if (this.connectionAttempts < this.maxConnectionAttempts) {
          this.connectionAttempts++;
          this.onStatusChange(`Retrying connection (${this.connectionAttempts}/${this.maxConnectionAttempts})...`, 'loading');
          setTimeout(() => this.createPeer(gameCode), 2000);
        } else {
          this.onStatusChange(`WebRTC error: ${err.type || 'Connection failed'}. Try switching networks.`, 'error');
          reject(err);
        }
      });

      this.peer.on('disconnected', () => {
        console.log('Peer disconnected, attempting to reconnect...');
        if (!this.peer.destroyed) {
          this.peer.reconnect();
        }
      });
    });
  }

  async joinGame (gameCode) {
    try {
      await this.loadPeerJS();
      this.onStatusChange('Connecting to game...', 'loading');
      this.isHost = false;
      this.connectionAttempts = 0;

      await this.createGuestPeer(gameCode);

    } catch (error) {
      console.error('Join game error:', error);
      this.onStatusChange('Failed to join: ' + error.message, 'error');
    }
  }

  async createGuestPeer (gameCode) {
    return new Promise((resolve, reject) => {
      this.peer = new Peer(undefined, this.getPeerConfig());

      // Longer timeout for cellular networks
      const timeout = setTimeout(() => {
        if (this.peer && !this.peer.open) {
          this.peer.destroy();
          reject(new Error('Connection timeout. Check the code.'));
        }
      }, 30000); // 30 seconds

      this.peer.on('open', (id) => {
        clearTimeout(timeout);
        console.log('Guest peer opened with ID:', id, 'connecting to:', gameCode);

        // Enhanced connection options for cellular
        this.connection = this.peer.connect(gameCode, {
          reliable: true,
          serialization: 'json',
          metadata: { timestamp: Date.now() }
        });

        this.setupConnection();
        resolve(id);
      });

      this.peer.on('error', (err) => {
        clearTimeout(timeout);
        console.error('Guest peer error:', err);

        // Retry logic for cellular networks
        if (err.type === 'network' && this.connectionAttempts < this.maxConnectionAttempts) {
          this.connectionAttempts++;
          this.onStatusChange(`Network error, retrying (${this.connectionAttempts}/${this.maxConnectionAttempts})...`, 'loading');
          setTimeout(() => this.createGuestPeer(gameCode), 2000);
        } else if (err.type === 'peer-unavailable') {
          this.onStatusChange('Game room not found. Check the code.', 'error');
          reject(err);
        } else {
          this.onStatusChange(`Failed to connect: ${err.type || 'Check the code'}. Try switching networks.`, 'error');
          reject(err);
        }
      });

      this.peer.on('disconnected', () => {
        console.log('Peer disconnected, attempting to reconnect...');
        if (!this.peer.destroyed) {
          this.peer.reconnect();
        }
      });
    });
  }

  setupConnection () {
    if (!this.connection) {
      console.error('No connection to setup');
      return;
    }

    console.log('Setting up connection...');

    // Connection timeout for cellular networks
    const connectionTimeout = setTimeout(() => {
      if (!this.isConnected) {
        console.warn('Connection setup timeout');
        this.onStatusChange('Connection timeout. Try again.', 'error');
        this.disconnect();
      }
    }, 25000); // 25 second timeout for connection setup

    this.connection.on('open', () => {
      clearTimeout(connectionTimeout);
      console.log('Connection opened successfully');
      this.isConnected = true;
      this.connectionAttempts = 0; // Reset attempts on success
      this.onStatusChange('Player connected. Starting game...', 'success');

      // Send a ping to verify connection works
      setTimeout(() => {
        this.sendMessage({ type: 'ping', timestamp: Date.now() });
      }, 1000);
    });

    this.connection.on('data', (data) => {
      console.log('Received data:', data);

      // Handle ping/pong for connection health
      if (data.type === 'ping') {
        this.sendMessage({ type: 'pong', timestamp: data.timestamp });
        return;
      }

      if (data.type === 'pong') {
        console.log('Connection health check passed');
        return;
      }

      if (this.onMessage && this.isConnected) {
        this.onMessage(data);
      }
    });

    this.connection.on('close', () => {
      clearTimeout(connectionTimeout);
      console.log('Connection closed');
      this.isConnected = false;
      this.onStatusChange('Connection lost', 'error');
    });

    this.connection.on('error', (err) => {
      clearTimeout(connectionTimeout);
      console.error('Connection error:', err);
      this.isConnected = false;
      this.onStatusChange('Connection error: ' + err.message, 'error');
    });
  }

  sendMessage (message) {
    if (this.connection && this.connection.open && this.isConnected) {
      console.log('Sending message:', message);
      try {
        this.connection.send(message);
        return true;
      } catch (error) {
        console.error('Failed to send message:', error);
        // Try to reconnect on send failure
        if (!this.peer.destroyed) {
          this.onStatusChange('Reconnecting...', 'loading');
          this.peer.reconnect();
        }
        return false;
      }
    }
    console.warn('Cannot send message - connection not ready. Connected:', this.isConnected, 'Open:', this.connection?.open);
    return false;
  }

  // Health check method
  checkConnectionHealth () {
    if (this.isConnected) {
      this.sendMessage({ type: 'ping', timestamp: Date.now() });
    }
  }

  disconnect () {
    console.log('Disconnecting...');
    this.isConnected = false;
    this.connectionAttempts = 0;

    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    this.isHost = false;
  }
}
