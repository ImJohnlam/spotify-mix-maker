const express = require('express');
const querystring = require('querystring');

const {asyncHandler, spotifyRequest, getToken, addImgSrc, addDetails} = require('./utils');

const router = express.Router({caseSensitive: true});
router.baseURL = '/public';

// get client credentials
router.use(asyncHandler(async (req, res, next) => {
   const form = { grant_type: 'client_credentials' };
   const authObj = await getToken(form);
   console.log(`authObj=${JSON.stringify(authObj)}`)
   req.accessToken = authObj.access_token;
   next();
}));

router.get('/search', asyncHandler(async (req, res) => {
   const path = `search?${querystring.stringify(req.query)}`;
   const type = req.query.type;
   const searchResults = await spotifyRequest('GET', path, req.accessToken)
                         .then(results => results[`${type}s`].items);
   
   searchResults.forEach(item => addImgSrc(item, type))
   res.json(searchResults)
   
   console.log(`result=${JSON.stringify(searchResults)}`)
   console.log('done search public')
}));

router.get('/details/:id', asyncHandler(async (req, res) => {
   const id = req.params.id;
   const trackPath = `tracks/${id}`;
   const featuresPath = `audio-features/${id}`;

   const track = await spotifyRequest('GET', trackPath, req.accessToken);
   const features = await spotifyRequest('GET', featuresPath, req.accessToken);

   const detailedTrack = {...track, ...features};

   addDetails(detailedTrack);
   addImgSrc(detailedTrack, 'track');
   res.send({...detailedTrack});
}));

router.get('/genres', asyncHandler(async (req, res) => {
   const path = 'recommendations/available-genre-seeds';
   const genres = await spotifyRequest('GET', path, req.accessToken);
   res.json(genres);
}));

router.get('/playlistitems/:playlistID', asyncHandler(async (req, res) => {
   const playlistID = req.params.playlistID;
   const query = querystring.stringify({
      ...req.query,
      fields: 'items(track(name, external_urls, id, uri, artists(name), album(images)))'
   });
   const path = `playlists/${playlistID}/tracks?${query}`;
   const playlistItems = await spotifyRequest('GET', path, req.accessToken);

   console.log(JSON.stringify(playlistItems, null, 2))
   const tracks = playlistItems.items.map(pt => {
      let track = pt.track;
      addImgSrc(track, 'track');
      return track;
   });
   res.send(tracks)
}));

router.get('/recommend', asyncHandler(async (req, res) => {
   const recsQuery = querystring.stringify({...req.query});
   const recsPath = `recommendations?${recsQuery}`;
   const recommendations = await spotifyRequest('GET', recsPath, req.accessToken)
                                 .then(recs => recs.tracks);

   recommendations.forEach(track => addImgSrc(track, 'track'));   
   res.send(recommendations);
}));

module.exports = router;