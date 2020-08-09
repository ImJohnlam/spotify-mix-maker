console.log("in player.js")
window.onSpotifyWebPlaybackSDKReady = () => {
   const token = 'BQCpai1wIuyPh4gHu29oi0e8IqIcxM2jTeKYlUXwC8elBQPOlAMaC7ajmcYX2s0oKQ5wwVr-pRuVYvFlMbeJata9PmNZo8b0Y--6O80ig73HtgV5rtJ-aOCkd1_XZ-o2ZpXHlYUAqlA8-HPqAbdZOSY7rUcoWqw618A';
   const player = new Spotify.Player({
     name: 'Web Playback SDK Quick Start Player',
     getOAuthToken: cb => { cb(token); }
   });

   // Error handling
   player.addListener('initialization_error', ({ message }) => { console.error(message); });
   player.addListener('authentication_error', ({ message }) => { console.error(message); });
   player.addListener('account_error', ({ message }) => { console.error(message); });
   player.addListener('playback_error', ({ message }) => { console.error(message); });

   // Playback status updates
   player.addListener('player_state_changed', state => { console.log(state); });

   // Ready
   player.addListener('ready', ({ device_id }) => {
     console.log('Ready with Device ID', device_id);
   });

   // Not Ready
   player.addListener('not_ready', ({ device_id }) => {
     console.log('Device ID has gone offline', device_id);
   });

   // Connect to the player!
   player.connect();
 };