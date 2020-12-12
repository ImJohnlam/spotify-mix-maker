import queryString from 'query-string';
import Cookies from 'js-cookie';

const baseURL = process.env.NODE_ENV === 'production' ?
 process.env.REACT_APP_API_URL : "http://localhost:3000/";
const headers = new Headers();
const reqConf = {
   headers: headers,
   credentials: 'include',
};

headers.set('Content-Type', 'application/JSON');

function chkFetch(url, options) {
   return fetch(url, options);
}

function get(endpoint) {
   return chkFetch(baseURL + endpoint, {
      method: 'GET',
      ...reqConf
   });
}

function post(endpoint, body) {
   return chkFetch(baseURL + endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...reqConf
   });
}

function del(endpoint, body) {
   return chkFetch(baseURL + endpoint, {
      method: 'DELETE',
      body: JSON.stringify(body),
      ...reqConf
   });
}

// AUTH RESOURCES

export function login() {
   window.location.assign(`${baseURL}auth/login`);
}

export function refreshToken() {
   window.location.assign(`${baseURL}auth/refresh?${queryString.stringify({refresh_token: Cookies.get('refresh_token')})}`);
}

// CLIENT RESOURCES

export function getTrack(id, cb) {
   return get(`client/details/${id}`)
   .then(res => res.json())
   .then(track => { if (cb) cb(track); });
}

export function search(query, cb) {
   return get(`client/search?${query}`)
   .then(res => res.json())
   .then(tracks => { if (cb) cb(tracks); });
}

export function getGenres(cb) {
   return get('client/genres')
   .then(res => res.json())
   .then(genres => { if (cb) cb(genres); });
}

export function getRecommendations(query, cb) {
   return get(`client/recommendations?${query}`)
   .then(res => res.json())
   .then(tracks => { if (cb) cb(tracks)});
}

export function getPlaylistItems(id, query, cb) {
   return get(`client/playlists/${id}/tracks${query ? `?${query}` : ''}`)
   .then(res => res.json())
   .then(tracks => {if (cb) cb(tracks); });
}

// USER RESOURCES

export function getMe(cb) {
   return get('user/me')
   .then(res => res.json())
   .then(me => {if (cb) cb(me); });
}

export function getUserPlaylists(query, cb) {
   return get(`user/me/playlists${query ? `?${query}` : ''}`)
   .then(res => res.json())
   .then(playlists => {if (cb) cb(playlists); });
}

export function createPlaylist(body, cb) {
   return post('user/playlists', body)
   .then(res => res.json())
   .then(playlist => { if (cb) cb(playlist); });
}

export function addTrackToPlaylist(playlistID, body, cb) {
   return post(`user/playlists/${playlistID}/tracks`, body)
   .then(res => res.json())
   .then(addRes => {if (cb) cb(addRes)} );
}

export function deleteTrackFromPlaylist(playlistID, body, cb) {
   return del(`user/playlists/${playlistID}/tracks`, body)
   .then(res => res.json())
   .then(delRes => {if (cb) cb(delRes); });
}
