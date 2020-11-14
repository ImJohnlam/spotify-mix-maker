const fetch = require('node-fetch');

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const secretKey = process.env.SECRET_KEY;

const asyncHandler = fn => 
 (req, res, next) => 
 fn(req, res, next)
 .catch(err => {console.log(err); res.send(err)});

const urlEncode = obj => Object.entries(obj).map(e=>e.join('=')).join('&');

// form is obj with params for token acquisition
const getToken = form => {
   const url = 'https://accounts.spotify.com/api/token';
   const options = {
      body: urlEncode(form),
      headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         Authorization: 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64'))
      },
      method: 'POST'
   };
   return fetch(url, options).then(data => data.json());
};

const spotifyRequest = (method, path, accessToken) => {
   const url = `https://api.spotify.com/v1/${path}`;
   const options = {
      headers: { Authorization: 'Bearer ' + accessToken },
      json: true,
      method: method
   };
   return fetch(url, options).then(data => data.json());
};

const addImgSrc = (item, type) => {
   if (type === 'track')
      item.imgSrc = item.album.images[0].url
   else if (type === 'artist' || type === 'playlist')
      item.imgSrc = item.images.length && item.images[0].url
};

const addDetails = track => {
   const keys = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
   const camelotNum = ((7 * track.key) + 5 + (track.mode ? 3 : 0)) % 12 || 12;
   const minutes = Math.round(track.duration_ms / 60000);
   const seconds = Math.round(track.duration_ms / 1000) % 60;
   const ratings = ['acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 'speechiness', 'valence']

   track.classical = keys[track.key] + (track.mode ? ' Major' : ' Minor');
   track.camelot = camelotNum.toString(10) + (track.mode ? 'B' : 'A')
   track.duration_min = minutes.toString(10) + ':' + (seconds < 10 ? '0' : '') + seconds.toString(10);
   track.bpm = Number.parseFloat(track.tempo).toFixed(2); // NOTE: consider rounding to 2 decimal places
   track.loudness = Math.round(track.loudness).toString(10) + ' dB'
   ratings.forEach(attr => track[attr] = Math.round(parseFloat(track[attr]) * 100))
};

module.exports = {
   asyncHandler,
   spotifyRequest,
   getToken,
   addImgSrc,
   addDetails
};
