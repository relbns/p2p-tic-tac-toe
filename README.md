# 🎮 Multi-Connection Tic Tac Toe

A revolutionary peer-to-peer Tic Tac Toe game that works **anywhere, anytime** - with or without internet! Choose from multiple connection methods based on your situation.

## 🌟 **Live Demo**

**Play now:** [https://relbns.github.io/p2p-tic-tac-toe/](https://relbns.github.io/p2p-tic-tac-toe/)

## ✨ **Features**

### 🔗 **Multiple Connection Methods**

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

### **1. Host a Game**

```
1. Open the game → Enter your name (optional)
2. Choose connection method based on your situation
3. Click "Host Game" → Share the generated code
4. Wait for someone to join → Start playing!
```

### **2. Join a Game**

```
1. Get the game code from your friend
2. Open the game → Choose same connection method
3. Click "Join Game" → Enter the code
4. Connected! Game begins automatically
```

## 🌍 **When to Use Each Method**

| Situation                  | Recommended Method | Why                                  |
| -------------------------- | ------------------ | ------------------------------------ |
| 🏠 Different locations     | **WebRTC**         | Works across any internet connection |
| ✈️ Airplane / No internet  | **Bluetooth**      | Direct device connection, ~10m range |
| 🏢 Same building           | **WiFi Hotspot**   | Great for multiple players           |
| 📱 One device available    | **QR Code**        | Pass phone between players           |
| 🌐 Best overall experience | **WebRTC**         | Lowest latency, most reliable        |

## 🛠 **Technical Features**

### **Peer-to-Peer Architecture**

- **No server costs** - Direct device-to-device communication
- **End-to-end encrypted** - All data transmitted securely
- **Low latency** - No middleman servers
- **Privacy focused** - No data stored on external servers

### **Connection Reliability**

- **Auto-detection** - Disables unsupported methods
- **Fallback CDNs** - Multiple sources for libraries
- **Graceful degradation** - Works even with limited capabilities
- **Reconnection handling** - Automatic recovery from drops

### **Mobile Optimizations**

- **Touch-friendly** - Proper hit targets and gestures
- **Native sharing** - Integration with device share sheet
- **PWA ready** - Can be installed as an app
- **Battery efficient** - Optimized for mobile devices

## 🎮 **Game Features**

### **Fair Play System**

- **Alternating starts** - Host goes first in game 1, guest in game 2, etc.
- **Move validation** - Prevents invalid moves and cheating
- **Synchronized state** - Consistent game state across devices
- **Disconnect handling** - Graceful handling of connection issues

### **User Experience**

- **Visual feedback** - Clear turn indicators and animations
- **Auto-minimize UI** - Focus on gameplay when connected
- **One-click sharing** - Easy code sharing with toast notifications
- **Responsive cursors** - Proper disabled/enabled states

## 📋 **Setup Instructions**

### **Deploy to GitHub Pages**

```bash
1. Fork this repository
2. Go to Settings → Pages
3. Source: Deploy from branch → main
4. Your game will be live at: https://yourusername.github.io/p2p-tic-tac-toe/
```

### **Local Development**

```bash
1. Clone the repository
2. Open index.html in your browser
3. Or serve with: python -m http.server 8000
4. Access at: http://localhost:8000
```

## 🌐 **Browser Support**

| Feature      | Chrome | Safari | Firefox | Edge |
| ------------ | ------ | ------ | ------- | ---- |
| WebRTC       | ✅     | ✅     | ✅      | ✅   |
| Bluetooth    | ✅     | ❌     | ❌      | ✅   |
| Native Share | ✅     | ✅     | ❌      | ✅   |
| QR Code      | ✅     | ✅     | ✅      | ✅   |
| WiFi Hotspot | ✅     | ✅     | ✅      | ✅   |

## 🔧 **Technical Stack**

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **P2P**: WebRTC with PeerJS library
- **Bluetooth**: Web Bluetooth API
- **Sharing**: Web Share API with clipboard fallback
- **Storage**: No external dependencies or servers

## 🎯 **Use Cases**

### **Perfect For:**

- **✈️ Travel gaming** - Airplane, train, car trips
- **🏫 Classroom activities** - No network restrictions
- **👨‍👩‍👧‍👦 Family time** - Cross-generational gaming
- **🌍 Remote friends** - Stay connected anywhere
- **🏢 Office breaks** - Quick games with colleagues

### **Real-World Scenarios:**

- Playing while camping (Bluetooth)
- International friends (WebRTC)
- Subway commute (QR Code)
- Coffee shop gaming (WiFi Hotspot)

## 🔒 **Privacy & Security**

- **No registration required** - Play instantly
- **No data collection** - Zero analytics or tracking
- **Encrypted communication** - WebRTC uses DTLS encryption
- **Local processing** - All game logic runs in your browser
- **Open source** - Fully auditable code

## 🚧 **Roadmap**

- [ ] **Tournament mode** - Multi-player brackets
- [ ] **AI opponent** - Play against computer
- [ ] **Voice chat** - WebRTC audio integration
- [ ] **Replay system** - Save and share games
- [ ] **Custom themes** - Personalize appearance
- [ ] **Statistics** - Track wins/losses locally

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📖 **API Documentation**

### **Game State Structure**

```javascript
{
  board: Array(9),        // Game board state
  currentTurn: 'X'|'O',   // Whose turn it is
  gameEnded: boolean,     // Game completion status
  winner: 'X'|'O'|null,   // Game winner
  hostStarts: boolean     // Turn alternation tracking
}
```

### **Message Protocol**

```javascript
// Move message
{ type: 'move', index: 0-8, symbol: 'X'|'O' }

// Player info
{ type: 'playerInfo', name: string, hostStarts: boolean }

// Game control
{ type: 'newGame', hostStarts: boolean }
{ type: 'gameStart', hostStarts: boolean, hostName: string }
```

## 📜 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 **Acknowledgments**

- **PeerJS** - Simplifying WebRTC implementation
- **Web Standards** - For making P2P web gaming possible
- **Open Source Community** - For inspiration and best practices

---

**Made with ❤️ for gamers everywhere**

_No servers, no signups, no limits - just pure peer-to-peer fun!_ 🎮✨
