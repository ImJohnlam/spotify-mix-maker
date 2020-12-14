const express = require('express');
const cryptoJS = require('crypto-js');
const querystring = require('query-string');

const {asyncHandler} = require('./utils');
const SpotifyRequest = require('./SpotifyRequest');

const clientID = process.env.CLIENT_ID;
const secretKey = process.env.SECRET_KEY;

const clientURL = process.env.CLIENT_URL || 'http://localhost:3001';
const redirectURI = process.env.REDIRECT_URL || 'http://localhost:3000/auth/callback';
const stateKey = 'spotify_auth_state';

const router = express.Router({caseSensitive: true});
router.baseURL = '/auth';


router.get('/login', (req, res) => {
   const state = cryptoJS.lib.WordArray.random(16).toString();
   const duration = 7200000;
   
   res.cookie(stateKey, state, {maxAge: duration, httpOnly: true});
   res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
         client_id: clientID,
         response_type: 'code',
         redirect_uri: redirectURI,
         state: state,
         scope: 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private'
   }));
});

router.get('/callback', asyncHandler(async (req, res) => {
   const code = req.query.code;
   const state = req.query.state;
   const storedState = req.cookies && req.cookies[stateKey];
   const form = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectURI
   };
   let authObj;
   
   if (!state || state !== storedState) {
      res.send("Cookies must be enabled.");
   }
   else {
      res.clearCookie(stateKey);

      authObj = await SpotifyRequest.getToken(form);
      res.cookie('access_token', cryptoJS.AES.encrypt(authObj.access_token, secretKey).toString());
      res.cookie('refresh_token', cryptoJS.AES.encrypt(authObj.refresh_token, secretKey).toString());
      res.cookie('expiry_date', parseInt(authObj.expires_in * 1000) + Date.now());
      res.redirect(clientURL);
   }
}));

router.get('/refresh', asyncHandler(async (req, res) => {
   const form = {
      grant_type: 'refresh_token',
      refresh_token: cryptoJS.AES.decrypt(req.cookies.refresh_token, secretKey).toString(cryptoJS.enc.Utf8)
   };
   const authObj = await SpotifyRequest.getToken(form);
   res.cookie('access_token', cryptoJS.AES.encrypt(authObj.access_token, secretKey).toString());
   res.cookie('expiry_date', parseInt(authObj.expires_in * 1000) + Date.now());
   res.redirect(clientURL);
}));

module.exports = router;
