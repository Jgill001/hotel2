// --- 1. THE AUDIO SILENCER ---
// Intercept Uncaught Promise Rejections globally
window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.name === 'NotSupportedError') {
        console.log("🛡️ AUDIO CRASH PREVENTED: Suppressed unhandled NotSupportedError!");
        event.preventDefault(); // Stop the grenade from killing the Unity thread
    }
});

// Intercept HTML5 Audio Playback
const originalPlay = HTMLAudioElement.prototype.play;
HTMLAudioElement.prototype.play = function() {
    return originalPlay.apply(this, arguments).catch(e => {
        console.log("🛡️ HTML AUDIO SILENCED: " + e.message);
    });
};

// Intercept WebAudio API Playback
if (window.AudioBufferSourceNode) {
    const originalStart = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function() {
        try {
            originalStart.apply(this, arguments);
        } catch (e) {
            console.log("🛡️ WEB AUDIO SILENCED: " + e.message);
        }
    };
}

// --- 2. THE CLEAN SDK ---
window.PokiSDK = {
    init: () => Promise.resolve(),
    commercialBreak: () => Promise.resolve(false),
    
    // Send the reward back immediately now that the thread won't die
    rewardedBreak: () => {
        console.log("SDK: Reward Requested. Handing true back to game.");
        return Promise.resolve(true);
    },
    
    setDebug: () => {},
    gameplayStart: () => {},
    gameplayStop: () => {},
    gameLoadingFinished: () => {},
    gameInteractive: () => {}
};

// Global Bindings
window.rewardedBreak = window.PokiSDK.rewardedBreak;
window.commercialBreak = window.PokiSDK.commercialBreak;
window.initPokiBridge = () => true;
