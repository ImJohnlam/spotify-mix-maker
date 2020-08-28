//TODO change config vars later
const baseURL = process.env.NODE_ENV === 'production' ?
 'https://test-app-jldt.herokuapp.com/' :
 "http://localhost:3000/";
const headers = new Headers();

headers.set('Content-Type', 'application/JSON');

const reqConf = {
   headers: headers,
   credentials: 'include',
};

function chkFetch(url, body) {
   return fetch(url, body);
}

function get(endpoint) {
   return chkFetch(baseURL + endpoint, {
      method: 'GET',
      ...reqConf
   });
}

export function getTop(cb) {
   return get('top')
   .then(res => res.json())
   .then(tracks => {if (cb) cb(tracks); })
}

export function getTrack(id, cb) {
   return get(`details/${id}`)
   .then(res => res.json())
   .then(track => { if (cb) cb(track); })
}

export function search(query, cb) {
   return get(`search?${query}`)
   .then(res => res.json())
   .then(tracks => { if (cb) cb(tracks); })
}

export function getGenres(cb) {
   return get('genres')
   .then(res => res.json())
   .then(genres => { if (cb) cb(genres); })
}

export function getRecommendations(query, cb) {
   return get(`recommend?${query}`)
   .then(res => res.json())
   .then(tracks => { if (cb) cb(tracks)})
}