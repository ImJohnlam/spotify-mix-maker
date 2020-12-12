const querystring = require('query-string');
const fetch = require('node-fetch');

class SpotifyRequest {
   constructor(req, accessToken) {
      this.req = req;
      this.options = {
         headers: { Authorization: 'Bearer ' + accessToken },
         json: true
      };
   }

   static clientID = process.env.CLIENT_ID;
   static clientSecret = process.env.CLIENT_SECRET;
   static baseURL = 'https://api.spotify.com/v1/';

   static getToken(form) {
      const url = 'https://accounts.spotify.com/api/token';
      const options = {
         body: Object.entries(form).map(e=>e.join('=')).join('&'),
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + (new Buffer(SpotifyRequest.clientID + ':' + SpotifyRequest.clientSecret).toString('base64'))
         },
         method: 'POST'
      };
      return fetch(url, options).then(data => data.json());
   };

   _addImgSrc(item, type) {
      if (type === 'track')
         item.imgSrc = item.album.images[0].url;
      else if (type === 'artist' || type === 'playlist')
         item.imgSrc = item.images.length && item.images[0].url;
   }

   _addDetails(track) {
      const keys = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
      const camelotNum = ((7 * track.key) + 5 + (track.mode ? 3 : 0)) % 12 || 12;
      const minutes = Math.round(track.duration_ms / 60000);
      const seconds = Math.round(track.duration_ms / 1000) % 60;
      const ratings = ['acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 'speechiness', 'valence'];
   
      track.classical = keys[track.key] + (track.mode ? ' Major' : ' Minor');
      track.camelot = camelotNum.toString(10) + (track.mode ? 'B' : 'A');
      track.duration_min = minutes.toString(10) + ':' + (seconds < 10 ? '0' : '') + seconds.toString(10);
      track.bpm = Number.parseFloat(track.tempo).toFixed(2);
      track.loudness = Math.round(track.loudness).toString(10) + ' dB';
      ratings.forEach(attr => track[attr] = Math.round(parseFloat(track[attr]) * 100));
   }

   _get(path) {
      const url = SpotifyRequest.baseURL + path;
      const options = {
         ...this.options,
         method: 'GET'
      };
      return fetch(url, options).then(data => data.json());
   }

   _post(path, body) {
      const url = SpotifyRequest.baseURL + path;
      const options = {
         ...this.options,
         method: 'POST',
         'Content-Type': 'application/json',
         body: JSON.stringify(body),
      };
      return fetch(url, options).then(data => data.json());
   }

   _delete(path, body) {
      const url = SpotifyRequest.baseURL + path;
      const options = {
         ...this.options,
         method: 'DELETE',
         'Content-Type': 'application/json',
         body: JSON.stringify(body),
      };
      return fetch(url, options).then(data => data.json());
   }

   // CLIENT RESOURCES

   async search() {
      const path = `search?${querystring.stringify(this.req.query)}`;
      const type = this.req.query.type;
      const searchResults = await this._get(path)
                            .then(results => results[`${type}s`].items);

      searchResults.forEach(item => this._addImgSrc(item, type));
      return searchResults;
   }

   async getTrack() {
      const id = this.req.params.id;
      const trackPath = `tracks/${id}`;
      const featuresPath = `audio-features/${id}`;

      const track = await this._get(trackPath);
      const features = await this._get(featuresPath);

      const detailedTrack = {...track, ...features};

      this._addDetails(detailedTrack);
      this._addImgSrc(detailedTrack, 'track');

      return detailedTrack;
   }

   async getPlaylistItems() {
      const id = this.req.params.id;
      const query = querystring.stringify({
         ...this.req.query,
         fields: 'items(track(name, external_urls, id, uri, artists(name), album(images)))'
      });
      const path = `playlists/${id}/tracks?${query}`;
      const playlistItems = await this._get(path);
      const tracks = playlistItems.items.map(pt => {
         let track = pt.track;
         this._addImgSrc(track, 'track');
         return track;
      });

      return tracks;
   }
   
   async getGenres() {
      const path = 'recommendations/available-genre-seeds';
      const genres = await this._get(path);
      return genres;
   }

   async getRecommendations() {
      const query = querystring.stringify({...this.req.query});
      const path = `recommendations?${query}`;
      const recommendations = await this._get(path).then(recs => recs.tracks);

      recommendations.forEach(track => this._addImgSrc(track, 'track'));
      return recommendations;
   }

   // USER RESOURCES
   
   async getMe() {
      const path = 'me';
      const userInfo = await this._get(path);
      return userInfo;
   }

   async getUserPlaylists() {
      const query = querystring.stringify({...this.req.query});
      const path = `me/playlists?${query}`;
      const playlists = await this._get(path);

      playlists.items.forEach(playlist => this._addImgSrc(playlist, 'playlist'));
      return playlists;
   }

   async createPlaylist() {
      const userInfo = await this.getMe();
      const createPlaylistPath = `users/${userInfo.id}/playlists`;
      const newPlaylist = await this._post(createPlaylistPath, this.req.body);

      return newPlaylist;
   }

   async addTrackToPlaylist() {
      const path = `playlists/${this.req.params.playlistID}/tracks`;
      const addTrackRes = await this._post(path, this.req.body);
      return addTrackRes;
   }
   
   async deleteTrackFromPlaylist() {
      const path = `playlists/${this.req.params.playlistID}/tracks`;
      const delTrackRes = await this._delete(path, this.req.body);
      return delTrackRes;
   }
};

module.exports = SpotifyRequest;