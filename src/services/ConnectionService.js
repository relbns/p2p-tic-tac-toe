export class ConnectionService {
    constructor (onMessage, onStatusChange) {
        this.peer = null;
        this.connection = null;
        this.onMessage = onMessage;
        this.onStatusChange = onStatusChange;
    }

    async loadPeerJS () {
        if (window.Peer) return;

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.4.7/peerjs.min.js';
        document.head.appendChild(script);

        return new Promise((resolve, reject) => {
            script.onload = () => setTimeout(resolve, 100);
            script.onerror = reject;
            setTimeout(() => reject(new Error('Script load timeout')), 10000);
        });
    }

    async hostGame (gameCode) {
        try {
            await this.loadPeerJS();
            this.onStatusChange('Creating game room...', 'loading');

            this.peer = new Peer(gameCode, {
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:global.stun.twilio.com:3478' }
                    ]
                }
            });

            this.peer.on('open', () => {
                this.onStatusChange('Game room created! Waiting for player...', 'success');
            });

            this.peer.on('connection', (conn) => {
                this.connection = conn;
                this.setupConnection();
                this.onStatusChange('Player connected!', 'success');
            });

            this.peer.on('error', (err) => {
                this.onStatusChange(`Error: ${err.type || 'Connection failed'}`, 'error');
            });

        } catch (error) {
            this.onStatusChange('Failed to create room: ' + error.message, 'error');
        }
    }

    async joinGame (gameCode) {
        try {
            await this.loadPeerJS();
            this.onStatusChange('Connecting to game...', 'loading');

            this.peer = new Peer();

            this.peer.on('open', () => {
                this.connection = this.peer.connect(gameCode, { reliable: true });
                this.setupConnection();
            });

            this.peer.on('error', (err) => {
                this.onStatusChange(`Failed to connect: ${err.type || 'Check the code'}`, 'error');
            });

        } catch (error) {
            this.onStatusChange('Failed to join: ' + error.message, 'error');
        }
    }

    setupConnection () {
        this.connection.on('open', () => {
            this.onStatusChange('Connected! Starting game...', 'success');
        });

        this.connection.on('data', (data) => {
            this.onMessage(data);
        });

        this.connection.on('close', () => {
            this.onStatusChange('Connection lost', 'error');
        });

        this.connection.on('error', (err) => {
            this.onStatusChange('Connection error', 'error');
        });
    }

    sendMessage (message) {
        if (this.connection && this.connection.open) {
            this.connection.send(message);
            return true;
        }
        return false;
    }

    disconnect () {
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
        this.connection = null;
    }
}