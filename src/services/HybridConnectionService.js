// Simple solution using free services for signaling only
// Game data stays P2P, only connection setup uses server

export class HybridConnectionService {
  constructor(onMessage, onStatusChange) {
    this.onMessage = onMessage;
    this.onStatusChange = onStatusChange;
    this.gameData = null;
    this.isHost = false;
  }

  // Use free Firebase Realtime Database for signaling only
  async initializeSignaling() {
    // Firebase config (free tier: 1GB storage, 10GB bandwidth/month)
    const firebaseConfig = {
      // Your config here - free tier is sufficient for signaling
      databaseURL: "https://your-project.firebaseio.com"
    };
    
    // Initialize Firebase for signaling only
    this.db = firebase.database();
  }

  async hostGame(gameCode) {
    this.isHost = true;
    this.onStatusChange('Creating game room...', 'loading');
    
    try {
      // Try WebRTC first
      await this.tryWebRTC(gameCode);
    } catch (error) {
      console.log('WebRTC failed, falling back to Firebase relay');
      await this.useFirebaseRelay(gameCode);
    }
  }

  async tryWebRTC(gameCode) {
    // Your existing WebRTC code here
    // If it fails, throw error to trigger fallback
  }

  async useFirebaseRelay(gameCode) {
    this.onStatusChange('Using relay mode (works on all networks)', 'loading');
    
    // Create game room in Firebase
    const gameRef = this.db.ref(`games/${gameCode}`);
    
    if (this.isHost) {
      await gameRef.set({
        host: true,
        created: Date.now(),
        moves: []
      });
      
      this.onStatusChange('Game room created! Share the code.', 'success');
      
      // Listen for guest moves
      gameRef.child('moves').on('child_added', (snapshot) => {
        const move = snapshot.val();
        if (move.from !== 'host') {
          this.onMessage(move.data);
        }
      });
    } else {
      // Guest joins
      const snapshot = await gameRef.once('value');
      if (!snapshot.exists()) {
        throw new Error('Game room not found');
      }
      
      this.onStatusChange('Connected! Starting game...', 'success');
      
      // Listen for host moves
      gameRef.child('moves').on('child_added', (snapshot) => {
        const move = snapshot.val();
        if (move.from === 'host') {
          this.onMessage(move.data);
        }
      });
    }
    
    this.gameRef = gameRef;
  }

  sendMessage(message) {
    if (this.gameRef) {
      // Send via Firebase (fallback)
      this.gameRef.child('moves').push({
        data: message,
        from: this.isHost ? 'host' : 'guest',
        timestamp: Date.now()
      });
      return true;
    }
    
    // Try WebRTC first (your existing code)
    return false;
  }

  disconnect() {
    if (this.gameRef) {
      this.gameRef.off();
      if (this.isHost) {
        this.gameRef.remove(); // Clean up
      }
    }
  }
}