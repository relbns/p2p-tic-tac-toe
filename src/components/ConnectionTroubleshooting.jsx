// Add this component to show when WebRTC fails on cellular
const ConnectionTroubleshooting = ({ onRetry, onSwitchMethod }) => (
  <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-xl p-4 mt-4">
    <h4 className="text-white font-semibold mb-2">📱 Having trouble connecting?</h4>
    <div className="text-sm text-white/90 space-y-2">
      <p>Cellular networks can sometimes block WebRTC connections. Try:</p>
      <ul className="list-disc list-inside space-y-1 ml-2">
        <li>Switch to WiFi if available</li>
        <li>Try a different cellular location</li>
        <li>Enable airplane mode for 10 seconds, then disable</li>
        <li>Use WiFi Hotspot mode instead</li>
      </ul>
      <div className="flex gap-2 mt-3">
        <button
          onClick={onRetry}
          className="flex-1 p-2 rounded-lg bg-blue-500/30 hover:bg-blue-500/40 text-white text-sm border border-blue-400/50"
        >
          Try Again
        </button>
        <button
          onClick={() => onSwitchMethod('hotspot')}
          className="flex-1 p-2 rounded-lg bg-green-500/30 hover:bg-green-500/40 text-white text-sm border border-green-400/50"
        >
          Use Hotspot Instead
        </button>
      </div>
    </div>
  </div>
);

export default ConnectionTroubleshooting;