//TODO change config vars later
export const baseURL = process.env.NODE_ENV === 'production' ?
 process.env.REACT_APP_API_URL :
 "http://localhost:3000/";
const headers = new Headers();

headers.set('Content-Type', 'application/JSON');

const reqConf = {
   headers: headers,
   credentials: 'include',
};


// NOTE: if refresh token expire, refresh mb?
export function chkFetch(url, options) {
   console.log(`fetching ${url}`)
   console.log()
   return fetch(url, options);
}

export function get(endpoint) {
   return chkFetch(baseURL + endpoint, {
      method: 'GET',
      ...reqConf
   });
}

export function post(endpoint, body) {
   return chkFetch(baseURL + endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...reqConf
   });
}

export function del(endpoint, body) {
   return chkFetch(baseURL + endpoint, {
      method: 'DELETE',
      body: JSON.stringify(body),
      ...reqConf
   });
}

export function getMe(cb) {
   return get('me')
   .then(res => res.json())
   .then(me => {if (cb) cb(me); })
}

export function getUserPlaylists(query, cb) {
   return get(`userplaylists${query ? '?' + query : ''}`)
   .then(res => res.json())
   .then(playlists => {if (cb) cb(playlists); })
}

export function getPlaylistItems(id, query, cb) {
   return get(`public/playlistitems/${id}${query ? '?' + query : ''}`)
   .then(res => res.json())
   .then(tracks => {if (cb) cb(tracks); })
}

export function createPlaylist(body, cb) {
   return post('playlist', body)
   .then(res => res.json())
   .then(playlist => { if (cb) cb(playlist); })
}

export function addTrackToPlaylist(playlistID, query, cb) {
   return post(`playlist/${playlistID}${query}`)
   .then(res => res.json())
   .then(addRes => {if (cb) cb(addRes)} )
}

export function deleteTrackFromPlaylist(playlistID, body, cb) {
   return del(`playlistitems/${playlistID}`, body)
   .then(res => res.json())
   .then(delRes => {if (cb) cb(delRes); })
}

export function getTrack(id, cb) {
   return get(`public/details/${id}`)
   .then(res => res.json())
   .then(track => { if (cb) cb(track); })
}

export function search(query, cb) {
   return get(`public/search?${query}`)
   .then(res => res.json())
   .then(tracks => { if (cb) cb(tracks); })
}

export function getGenres(cb) {
   return get('public/genres')
   .then(res => res.json())
   .then(genres => { if (cb) cb(genres); })
}

export function getRecommendations(query, cb) {
   return get(`public/recommend?${query}`)
   .then(res => res.json())
   .then(tracks => { if (cb) cb(tracks)})
}