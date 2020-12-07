const express = require('express');
const cryptoJS = require('crypto-js');

const {asyncHandler} = require('./utils');
const SpotifyRequest = require('./SpotifyRequest');

const secretKey = process.env.SECRET_KEY;

const router = express.Router({caseSensitive: true});
router.baseURL = '/user';

router.use(asyncHandler(async (req, res, next) => {
   const accessToken = cryptoJS.AES.decrypt(req.cookies.access_token, secretKey).toString(cryptoJS.enc.Utf8);
   req.spotifyRequest = new SpotifyRequest(req, accessToken);
   next();
}));

router.get('/me', asyncHandler(async (req, res) => {
   const userInfo = await req.spotifyRequest.getMe();
   res.json(userInfo);
}));

router.get('/me/playlists', asyncHandler(async (req, res) => {
   const playlists = await req.spotifyRequest.getUserPlaylists();
   res.json(playlists);
}));

router.post('/playlists', asyncHandler(async (req, res) => {
   const newPlaylist = await req.spotifyRequest.createPlaylist();
   res.json(newPlaylist);
}));

router.post('/playlists/:playlistID/tracks', asyncHandler(async (req, res) => {
   const addTrackRes = await req.spotifyRequest.addTrackToPlaylist();
   res.json(addTrackRes);
}));

router.delete('/playlists/:playlistID/tracks', asyncHandler(async (req, res) => {
   const delTrackRes = await req.spotifyRequest.deleteTrackFromPlaylist();
   res.json(delTrackRes);
}))

module.exports = router;