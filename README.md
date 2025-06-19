# 🎮 Multi-Connection Tic Tac Toe

A revolutionary peer-to-peer Tic Tac Toe game that works **anywhere, anytime** - with or without internet! Choose from multiple connection methods based on your situation, or play locally on the same device.

## 🌟 **Live Demo**
**Play now:** [https://relbns.github.io/p2p-tic-tac-toe/](https://relbns.github.io/p2p-tic-tac-toe/)

## ✨ **Features**

### 🎯 **Game Modes**
- **🏠 Local Game** - Play one-on-one on the same device (perfect for quick games!)
- **🌐 WebRTC** - Internet-based P2P gaming across any network
- **📶 Bluetooth** - Direct device connection, no internet required (10m range)
- **📡 WiFi Hotspot** - Local network gaming for multiple players
- **📱 QR Code** - Pass-and-play mode with state sharing

### 🎯 **Smart Gameplay**
- **Alternating First Player** - Host and guest take turns starting new games
- **Real-time Sync** - Instant move updates across all connection types
- **Turn Indicators** - Clear visual cues for whose turn it is
- **Player Names** - Optional custom names for personalized gaming

### 📱 **Cross-Platform**
- **Mobile Responsive** - Perfect on phones, tablets, and desktop
- **Progressive Enhancement** - Works on any modern browser
- **Native Sharing** - Share game codes via WhatsApp, SMS, email, etc.
- **Offline Gaming** - Multiple options for internet-free play

## 🚀 **Quick Start**

### **1. Local Game (Recommended for beginners)**
```
1. Open the game → Click "Local Game (Same Device)"
2. Enter player name (optional) → Start playing immediately!
3. Pass device between players for each turn
```

### **2. Remote Game**
```
Host a Game:
1. Choose connection method → Click "Host Game"
2. Share the generated code with your friend
3. Wait for them to join → Start playing!

Join a Game:
1. Get the game code from your friend
2. Choose same connection method → Click "Join Game"
3. Enter the code → Connected! Game begins automatically
```

## 🌍 **When to Use Each Method**

| Situation | Recommended Method | Why |
|-----------|-------------------|-----|
| 🏠 Same location | **Local Game** | Instant setup, no connection needed |
| 🏠 Different locations | **WebRTC** | Works across any internet connection |
| ✈️ Airplane / No internet | **Bluetooth** | Direct device connection, ~10m range |
| 🏢 Same building | **WiFi Hotspot** | Great for multiple players |
| 📱 One device available | **Local Game** or **QR Code** | Perfect for face-to-face gaming |

## 🛠 **Development**

### **Setup**
```bash
# Clone the repository
git clone https://github.com/relbns/p2p-tic-tac-toe.git
cd p2p-tic-tac-toe

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Build & Deploy**
```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### **Project Structure**
```
src/
├── components/          # React components
│   ├── GameBoard.jsx    # 3x3 game grid
│   ├── PlayerInfo.jsx   # Player names and status
│   ├── ConnectionSetup.jsx # Connection method selection
│   └── ConnectionBadge.jsx # Connection status display
├── services/            # Business logic
│   ├── GameService.js   # Game rules and state
│   └── ConnectionService.js # WebRTC and connections
├── hooks/               # React hooks
│   ├── useGame.js       # Game state management
│   └── useConnection.js # Connection state management
└── utils/               # Utility functions
    └── helpers.js       # Helper functions
```

## 🎮 **Game Features**

### **Fair Play System**
- **Alternating starts** - Host goes first in game 1, guest in game 2, etc.
- **Move validation** - Prevents invalid moves and cheating
- **Synchronized state** - Consistent game state across devices
- **Local gameplay** - Perfect turn-by-turn gaming on same device

### **User Experience**
- **Visual feedback** - Clear turn indicators and animations
- **One-click sharing** - Easy code sharing with toast notifications
- **Responsive design** - Works perfectly on all screen sizes
- **Copyright attribution** - © 2024 @relbns - Open Source

## 📋 **Deployment Instructions**

### **Deploy to GitHub Pages**
```bash
# First time setup
npm install gh-pages --save-dev

# Deploy (builds automatically)
npm run deploy

# Your game will be live at:
# https://yourusername.github.io/p2p-tic-tac-toe/
```

### **Environment Configuration**
The app is configured for GitHub Pages deployment:
- **Base path**: `/p2p-tic-tac-toe/`
- **Build output**: `dist/`
- **Homepage**: `https://relbns.github.io/p2p-tic-tac-toe`

## 🌐 **Browser Support**

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Local Game | ✅ | ✅ | ✅ | ✅ |
| WebRTC | ✅ | ✅ | ✅ | ✅ |
| Bluetooth | ✅ | ❌ | ❌ | ✅ |
| Native Share | ✅ | ✅ | ❌ | ✅ |
| QR Code | ✅ | ✅ | ✅ | ✅ |

## 🔧 **Technical Stack**

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **P2P**: WebRTC with PeerJS library
- **Bluetooth**: Web Bluetooth API
- **Sharing**: Web Share API with clipboard fallback
- **Deployment**: GitHub Pages

## 🎯 **Use Cases**

### **Perfect For:**
- **🏠 Family game night** - Local games on tablet/phone
- **☕ Coffee shop gaming** - Quick local matches
- **✈️ Travel gaming** - Airplane, train, car trips (local/bluetooth)
- **🌍 Remote friends** - Stay connected anywhere (WebRTC)
- **🏫 Classroom activities** - No network restrictions needed
- **🏢 Office breaks** - Quick games with colleagues

## 🔒 **Privacy & Security**

- **No registration required** - Play instantly
- **No data collection** - Zero analytics or tracking
- **Encrypted communication** - WebRTC uses DTLS encryption
- **Local processing** - All game logic runs in your browser
- **Open source** - Fully auditable code

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📜 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 **Acknowledgments**

- **PeerJS** - Simplifying WebRTC implementation
- **Web Standards** - For making P2P web gaming possible
- **React Community** - For excellent documentation and tools
- **Tailwind CSS** - For beautiful, responsive styling

---

**Made with ❤️ by @relbns**

*No servers, no signups, no limits - just pure peer-to-peer fun!* 🎮✨

Copyright © 2024 @relbns - Open Source Project
