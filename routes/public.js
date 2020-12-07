const express = require('express');

const {asyncHandler} = require('./utils');
const SpotifyRequest = require('./SpotifyRequest');

const router = express.Router({caseSensitive: true});
router.baseURL = '/public';

// get client credentials
router.use(asyncHandler(async (req, res, next) => {
   const form = { grant_type: 'client_credentials' };
   const authObj = await SpotifyRequest.getToken(form);
   req.spotifyRequest = new SpotifyRequest(req, authObj.access_token);
   next();
}));

router.get('/search', asyncHandler(async (req, res) => {
   const results = await req.spotifyRequest.search();
   res.json(results);
}));

router.get('/details/:id', asyncHandler(async (req, res) => {
   const detailedTrack = await req.spotifyRequest.getTrack();
   res.json(detailedTrack);
}));

router.get('/genres', asyncHandler(async (req, res) => {
   const genres = await req.spotifyRequest.getGenres();
   res.json(genres);
}));

router.get('/playlists/:id/tracks', asyncHandler(async (req, res) => {
   const playlistItems = await req.spotifyRequest.getPlaylistItems();
   res.json(playlistItems);
}));

router.get('/recommendations', asyncHandler(async (req, res) => {
   const recommendations = await req.spotifyRequest.getRecommendations();
   res.json(recommendations);
}));

module.exports = router;