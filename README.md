# 🎮 Multi-Connection Tic Tac Toe 
![Deploy](https://github.com/relbns/p2p-tic-tac-toe/actions/workflows/deploy.yml/badge.svg)


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

### 🔗 **Smart Sharing**
- **Auto-Join URLs** - Share links like `yoursite.com/?code=ABCD` for instant joining
- **One-Click Connect** - Friends just click the link and enter their name (optional)
- **Native Sharing** - Integration with device share sheet (WhatsApp, SMS, etc.)
- **Clipboard Sharing** - Automatic URL copying with game codes

### 🎯 **Smart Gameplay**
- **Alternating First Player** - Host and guest take turns starting new games
- **Real-time Sync** - Instant move updates across all connection types
- **Turn Indicators** - Clear visual cues for whose turn it is
- **Player Names** - Optional custom names for personalized gaming

### 📱 **Cross-Platform Design**
- **Mobile Responsive** - Perfect on phones, tablets, and desktop
- **High Contrast** - Beautiful blue gradient design with excellent text readability
- **Modern UI** - Glassmorphism effects with backdrop blur
- **Progressive Enhancement** - Works on any modern browser
- **Offline Gaming** - Multiple options for internet-free play

## 🎨 **Design & Accessibility**

### **Color Scheme**
- **Primary Gradient**: Blue gradient (from-blue-600 via-blue-700 to-indigo-800) inspired by the app icon
- **High Contrast Text**: White text with shadows for excellent readability on all backgrounds
- **Glassmorphism**: Semi-transparent elements with backdrop blur effects
- **Consistent Branding**: Colors perfectly match the beautiful blue Tic Tac Toe app icon

### **User Experience**
- **Visual Feedback** - Clear turn indicators and smooth animations
- **Accessible Colors** - High contrast ratios for text readability
- **Touch-Friendly** - Proper hit targets for mobile devices
- **Responsive Design** - Works perfectly on all screen sizes
- **Loading States** - Clear feedback during connections

## 🚀 **Quick Start**

### **1. Local Game (Recommended for beginners)**
```
1. Open the game → Click "Local Game (Same Device)"
2. Enter player name (optional) → Start playing immediately!
3. Pass device between players for each turn
```

### **2. Remote Game with Auto-Join**
```
Host a Game:
1. Choose WebRTC → Click "Host Game" 
2. Share the generated URL (includes game code automatically)
3. Wait for friend to join → Start playing!

Join via URL:
1. Click the shared link (e.g., yoursite.com/?code=AB12)
2. App shows "Join Game?" prompt with the code
3. Enter name (optional) → Click "Join Game" → Connected instantly!
```

### **3. Manual Remote Game**
```
Host: Choose connection method → Host Game → Share 4-letter code
Join: Choose same method → Join Game → Enter code → Connect
```

## 🌍 **When to Use Each Method**

| Situation | Recommended Method | Why |
|-----------|-------------------|-----|
| 🏠 Same location | **Local Game** | Instant setup, no connection needed |
| 🌐 Different locations | **WebRTC** | Works across any internet connection |
| ✈️ Airplane / No internet | **Bluetooth** | Direct device connection, ~10m range |
| 🏢 Same building | **WiFi Hotspot** | Great for multiple players |
| 📱 One device available | **Local Game** or **QR Code** | Perfect for face-to-face gaming |
| 🔗 Easy sharing | **WebRTC with URLs** | Send link, friend joins instantly |

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

# Automatic deployment via GitHub Actions
git push origin main  # Triggers auto-deployment
```

### **Project Structure**
```
src/
├── components/          # React components
│   ├── GameBoard.jsx    # 3x3 game grid with high contrast
│   ├── PlayerInfo.jsx   # Player names and status
│   ├── ConnectionSetup.jsx # Connection method selection
│   ├── ConnectionBadge.jsx # Connection status display
│   └── AutoJoinPrompt.jsx  # Auto-join from URL prompt
├── services/            # Business logic
│   ├── GameService.js   # Game rules and state
│   └── ConnectionService.js # WebRTC and connections (improved)
├── hooks/               # React hooks
│   ├── useGame.js       # Game state management
│   └── useConnection.js # Connection state management
└── utils/               # Utility functions
    └── helpers.js       # Helper functions (+ URL handling)
```

## 🎮 **Game Features**

### **Fair Play System**
- **Alternating starts** - Host goes first in game 1, guest in game 2, etc.
- **Move validation** - Prevents invalid moves and cheating
- **Synchronized state** - Consistent game state across devices
- **Local gameplay** - Perfect turn-by-turn gaming on same device

### **Connection Management**
- **Auto-reconnection** - Handles temporary disconnections
- **Error recovery** - Clear error messages with retry options
- **Connection debugging** - Console logs for troubleshooting
- **Multiple CDN fallbacks** - Reliable PeerJS library loading

### **Sharing & Discovery**
- **Smart URLs** - `yoursite.com/?code=ABCD&method=webrtc`
- **Auto-detection** - Detects game codes in URLs automatically
- **Beautiful prompts** - Professional join game interface
- **Cross-platform sharing** - Works on all devices

## 📋 **Deployment Instructions**

### **Deploy to GitHub Pages**
```bash
# First time setup
npm install

# Deploy (builds automatically)
npm run deploy

# Your game will be live at:
# https://yourusername.github.io/p2p-tic-tac-toe/
```

### **Automatic Deployment**
- **GitHub Actions** - Auto-deploys on push to main branch
- **Environment Configuration** - Properly configured for GitHub Pages
- **Asset Optimization** - Vite builds optimized production assets

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
| Auto-Join URLs | ✅ | ✅ | ✅ | ✅ |
| Bluetooth | ✅ | ❌ | ❌ | ✅ |
| Native Share | ✅ | ✅ | ❌ | ✅ |
| QR Code | ✅ | ✅ | ✅ | ✅ |

## 🔧 **Technical Stack**

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS with custom blue gradient theme
- **P2P**: WebRTC with PeerJS library (improved reliability)
- **Bluetooth**: Web Bluetooth API
- **Sharing**: Web Share API with clipboard fallback + URL generation
- **Deployment**: GitHub Pages with GitHub Actions

## 🎯 **Use Cases**

### **Perfect For:**
- **🏠 Family game night** - Local games on tablet/phone
- **☕ Coffee shop gaming** - Quick local matches
- **✈️ Travel gaming** - Airplane, train, car trips (local/bluetooth)
- **🌍 Remote friends** - Stay connected anywhere (WebRTC + auto-join)
- **🏫 Classroom activities** - No network restrictions needed
- **🏢 Office breaks** - Quick games with colleagues
- **📱 Easy sharing** - Send link, friend joins instantly

### **Real-World Scenarios:**
- **Family dinner**: Pass tablet around for local game
- **Remote work break**: Send WebRTC URL to colleague via Slack
- **Flight entertainment**: Use Bluetooth for seatmate gaming
- **Study group**: Create WiFi hotspot for multiple players
- **Date night**: Local game mode for couples

## 🔒 **Privacy & Security**

- **No registration required** - Play instantly
- **No data collection** - Zero analytics or tracking
- **Encrypted communication** - WebRTC uses DTLS encryption
- **Local processing** - All game logic runs in your browser
- **Open source** - Fully auditable code
- **No server storage** - Game codes only exist during active sessions

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Development Guidelines**
- Follow the existing color scheme (blue gradients)
- Ensure high contrast for accessibility
- Test on multiple devices and browsers
- Maintain consistent glassmorphism design

## 📜 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## 🎉 **Acknowledgments**

- **PeerJS** - Simplifying WebRTC implementation
- **Web Standards** - For making P2P web gaming possible
- **React Community** - For excellent documentation and tools
- **Tailwind CSS** - For beautiful, responsive styling
- **Icon Design** - Beautiful blue Tic Tac Toe icon that inspired the color scheme

---

**Made with ❤️ by @relbns**

*No servers, no signups, no limits - just pure peer-to-peer fun!* 🎮✨

**Features:**
- 🏠 **Local Gaming** - Play instantly on same device
- 🔗 **Smart Sharing** - Send links, friends join with one click
- 🎨 **Beautiful Design** - High contrast blue theme
- 🌐 **Cross-Platform** - Works everywhere
- 🔒 **Privacy-First** - No data collection

Copyright © 2024 @relbns - Open Source Project
