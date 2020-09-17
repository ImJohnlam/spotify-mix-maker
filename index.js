const express = require('express');
const request = require('request');
const fetch = require('node-fetch')
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const crypto = require('crypto');
const cryptoJS = require('crypto-js');
const url = require('url');

const app = express();

const creds = require('./creds.json');

const PORT = process.env.PORT || 3000

const clientURL = process.env.clientURL || 'http://localhost:3001';

const redirectURI = process.env.redirectURI || 'http://localhost:3000/callback';
const stateKey = 'spotify_auth_state';

const apiReqConf = {}
const apiURL = ''

const authReqConf = {}
const authURL = ''

let wrapAsync = fn => (req, res, next) => fn(req, res, next).catch(err => {console.log(err); res.send(err)})

app.use(bodyParser());
app.use(cookieParser());

if (process.env.NODE_ENV === 'production')
   app.use(express.static('client/build'));
else
   app.use(express.static(__dirname + '/public'));

// app.use(cors());
app.use(function(req, res, next) {
   console.log("Handling " + req.path + '/' + req.method);
   console.log(`query=${JSON.stringify(req.query)}`)
   res.header("Access-Control-Allow-Origin", clientURL);
   res.header("Access-Control-Allow-Credentials", true);
   res.header("Access-Control-Allow-Headers", "Content-Type");
   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
   res.header("Access-Control-Expose-Headers", "Content-Type, Location");
   next();
});

app.options("/*", function(req, res) {
   res.status(200).end();
});

//debug
app.use((req, res, next) => {
   console.log(`cookies: ${JSON.stringify(req.cookies)}\n`)
   console.log(`access_token=${req.cookies.access_token}\n`)
   req.cookies.access_token && console.log(`decrpyted access_token=${cryptoJS.AES.decrypt(req.cookies.access_token, creds.secret_key).toString(cryptoJS.enc.Utf8)}\n`)
   
   next()
})

// decrypt tokens
app.use((req, res, next) => {
   if (req.path === '/me' || req.path === '/userplaylists' || (req.path.includes('/playlist') && req.method !== 'GET'))
      req.accessToken = cryptoJS.AES.decrypt(req.cookies.access_token, creds.secret_key).toString(cryptoJS.enc.Utf8)
      // req.accessToken = cryptoJS.AES.decrypt(req.query.access_token, creds.secret_key).toString(cryptoJS.enc.Utf8);
   else if (req.path === '/refresh'){
      console.log(req.query)
      console.log(`cookies=${JSON.stringify(req.cookies)}`)
      console.log(`req.query.refresh_token=${req.query.refresh_token}`)
      req.refreshToken = cryptoJS.AES.decrypt(req.cookies.refresh_token, creds.secret_key).toString(cryptoJS.enc.Utf8);
   }

   next()
})

// TO DO: save client credentials to reuse
// get client credentials
app.use((req, res, next) => {
   if (req.path === '/me' || req.path === '/userplaylists' || (req.path.includes('/playlist') && req.method !== 'GET'))
      next()
   else if (req.path === '/search' || req.path === '/top' || '/details' || req.path === '/genres' || req.path === '/recommend') {
      const authOptions = {
         url: 'https://accounts.spotify.com/api/token',
         form: {
            grant_type: 'client_credentials'
         },
         headers: {
            Authorization: 'Basic ' + (new Buffer(creds.client_id + ':' + creds.client_secret).toString('base64'))
         }
      };

      console.log(`getting client credentials req.path=${req.path}`);
      request.post(authOptions, (tErr, tRes, tBody) => {
         let authObj = JSON.parse(tBody);
         let accessToken = authObj.access_token;
         
         req.accessToken = accessToken;
         next();
      })
   }
   else
      next();
});

// TODO: stock img
let addImgSrc = (items, type) => {
   items.forEach((item) => {
      // console.log(item.name)
      if (type === 'track')
         item.imgSrc = item.album.images[0].url
      else if (type === 'artist' || type === 'playlist')
         item.imgSrc = item.images.length && item.images[0].url
   })
}

app.get('/search', (req, res) => {
   let options = {
      url: 'https://api.spotify.com/v1/search' + url.parse(req.url, true).search,
      headers: { Authorization: 'Bearer ' + req.accessToken },
      json: true
   };

   request.get(options, (sErr, sRes, sBody) => {
      console.log(JSON.stringify(sBody, null, 2))
      let results = sBody[`${req.query.type}s`].items;

      // results.forEach((item) => {
      //    console.log(item.name)
      //    if (req.query.type === 'track')
      //       item.imgSrc = item.album.images[0].url
      //    else if (req.query.type === 'artist')
      //       item.imgSrc = item.images.length && item.images[0].url
      // })
      addImgSrc(results, req.query.type);
      res.json(results)
      console.log(req.query)
   })
})

app.get('/genres', (req, res) => {
   let options = {
      url: 'https://api.spotify.com/v1/recommendations/available-genre-seeds',
      headers: { Authorization: 'Bearer ' + req.accessToken },
      json: true
   };

   request.get(options, (gErr, gRes, gBody) => {
      console.log(JSON.stringify(gBody, null, 2))

      res.json(gBody.genres)
   })
})

app.get('/login', (req, res) => {
   const state = crypto.randomBytes(16).toString('hex');
   const duration = 7200000;

   res.cookie(stateKey, state, {maxAge: duration, httpOnly: true});
   res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
         client_id: creds.client_id,
         response_type: 'code',
         redirect_uri: redirectURI,
         state: state,
         scope: 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private'
   }));
});

// nts: have client access cookie/localStorage?
app.get('/callback', (req, res) => {
   const code = req.query.code;
   const state = req.query.state;
   const storedState = req.cookies && req.cookies[stateKey];
   let authOptions;
   
   if (!state || state !== storedState) {
      console.log(`err in /callback\nstate=${state}\nstoredState=${storedState}`)
      res.send("enable cookies pls");
   }
   else {
      console.log("callback ok")
      res.clearCookie(stateKey);
      // DEBUG:
      res.cookie('test_cookie', 'test_123')
      res.cookie('test_secure1', 'secure_cookie1', {httpOnly: true});

      res.clearCookie('test_cookie')
      res.clearCookie('test_secure1')

      authOptions = {
         url: 'https://accounts.spotify.com/api/token',
         form: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectURI
         },
         headers: {
            Authorization: 'Basic ' + (new Buffer(creds.client_id + ':' + creds.client_secret).toString('base64'))
         },
         json: true
      };

      // use token to access API
      request.post(authOptions, (tokErr, tokRes, tokBody) => {
         if (!tokErr) {
            let accessToken = tokBody.access_token,
             refreshToken = tokBody.refresh_token;
            console.log(`2 accessing api, accessToken=${accessToken}\n`);
            

            res.cookie('access_token', cryptoJS.AES.encrypt(accessToken, creds.secret_key).toString())
            res.cookie('refresh_token', cryptoJS.AES.encrypt(refreshToken, creds.secret_key).toString())
            res.cookie('expiry_date', parseInt(tokBody.expires_in * 1000) + Date.now())

         }
         else {
            console.log(`api access tokErr=${tokErr}`);
         }
         // res.send('cb');
         console.log('redirect back to client')
         
         res.redirect(clientURL)
      });
   }
});

app.get('/refresh', (req, res) => {
   let options = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
         Authorization: 'Basic ' + (new Buffer(creds.client_id + ':' + creds.client_secret).toString('base64'))
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: req.refreshToken
      },
      json: true
    };

    request.post(options, (error, response, body) => {
      if (error)
         console.log(`error refresh: ${error}`)
      else {
         console.log(`in refresh, body=${JSON.stringify(body, null, 2)}`)
         let accessToken = body.access_token;
         res.cookie('access_token', cryptoJS.AES.encrypt(accessToken, creds.secret_key).toString())
         res.cookie('expiry_date', parseInt(body.expires_in * 1000) + Date.now())
         console.log(`refreshed, accessToken=${accessToken}`)
         res.redirect(clientURL)
      }
    })
});

app.get('/me', (req, res) => {
   let options = {
      url: 'https://api.spotify.com/v1/me',
      headers: { Authorization: 'Bearer ' + req.accessToken },
      json: true
   };

   request.get(options, (error, resp, body) => {
      console.log(`in /me accesstoken=${req.accessToken}\ncookes=${JSON.stringify(req.cookies)}\nres=${JSON.stringify(body, null, 2)}`)
      res.json(body)
   });
})

app.get('/userplaylists', wrapAsync(async (req, res) => {
   let query = querystring.stringify({...req.query});
   let url = `https://api.spotify.com/v1/me/playlists?${query}`
   let options = {
      headers: { Authorization: 'Bearer ' + req.accessToken },
      json: true
   }

   let playlists = await fetch(url, options).then(data => data.json())
   console.log(JSON.stringify(playlists, null, 2))
   addImgSrc(playlists.items, 'playlist')
   res.send(playlists)
   console.log(`userplaylist url=${url}`)
}))

app.post('/playlist', wrapAsync(async (req, res) => {
   let userInfoURL = 'https://api.spotify.com/v1/me'
   let userInfoOptions = {
      headers: { Authorization: 'Bearer ' + req.accessToken },
      json: true
   };

   let userInfo = await fetch(userInfoURL, userInfoOptions).then(data => data.json())
   console.log(JSON.stringify(userInfo, null, 2))
   let createPlaylistURL = `https://api.spotify.com/v1/users/${userInfo.id}/playlists`
   let createPlaylistOptions = {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + req.accessToken },
      'Content-Type': 'application/json',
      body: JSON.stringify({name: req.body.name}),
      json: true
   }

   let newPlaylist = await fetch(createPlaylistURL, createPlaylistOptions).then(data => data.json())
   console.log(newPlaylist)
   res.send(newPlaylist)

}))

app.post('/playlist/:playlistID', wrapAsync(async (req, res) => {
   const query = querystring.stringify({
      ...req.query
   })
   const url = `https://api.spotify.com/v1/playlists/${req.params.playlistID}/tracks?${query}`
   const options = {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + req.accessToken },
      json: true
   }
   const addTrackRes = await fetch(url, options).then(data => data.json());
   console.log(`addTrackRes=${JSON.stringify(addTrackRes)}`)
   res.send(addTrackRes)
}))

app.delete('/playlistitems/:playlistID', wrapAsync(async (req, res) => {
   const url = `https://api.spotify.com/v1/playlists/${req.params.playlistID}/tracks`
   const options = {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + req.accessToken },
      'Content-Type': 'application/json',
      body: JSON.stringify({tracks: req.body.tracks}),
      json: true
   }

   const delTrackRes = await fetch(url, options).then(data => data.json());
   console.log(`delTrackRes=${JSON.stringify(delTrackRes)}`)
   res.send(delTrackRes)
}))

app.get('/playlistitems/:playlistID', wrapAsync(async (req, res) => {
   let query = querystring.stringify({
      ...req.query,
      fields: 'items(track(name, external_urls, id, uri, artists(name), album(images)))'
   });
   const playlistID = req.params.playlistID;
   
   let url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks?` + query;
   let options = {
      headers: { Authorization: 'Bearer ' + req.accessToken },
      json: true
   }
   // try{
   const playlistItems = await fetch(url, options).then(data => data.json())
   console.log(JSON.stringify(playlistItems, null, 2))
   let tracks = playlistItems.items.map(pt => pt.track);
   addImgSrc(tracks, 'track')
   res.send(tracks)
   // }
   // catch(e) {console.log(`e:${e}`)}
   
   // request.get(options, (error, response, body) => {
   //    console.log(body)
   //    let tracks = body.items.map(pt => pt.track);
   //    addImgSrc(tracks, 'track')
   //    res.send(tracks)
   // })
   console.log('playlist item end')
}))

function addDetails(tracks) {
   tracks.forEach(track => {
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
   })
}

//TODO: add imgSrc handler w/ stock img path

app.get('/details/:id', async (req, res) => {
   const id = req.params.id;
   let trackOptions = {
      url: `https://api.spotify.com/v1/tracks/${id}`,
      headers: { Authorization: 'Bearer ' + req.accessToken },
      json: true
   }

   request.get(trackOptions, (tErr, tRes, tBody) => {
      let featuresOptions = {
         url: `https://api.spotify.com/v1/audio-features/${id}`,
         headers: { Authorization: 'Bearer ' + req.accessToken },
         json: true  
      }

      request.get(featuresOptions, (fErr, fRes, fBody) => {
         let detailedTrack = {...tBody, ...fBody};
         addDetails([detailedTrack])
         addImgSrc([detailedTrack], 'track')
         console.log(`detailedTrack=${JSON.stringify(detailedTrack, null, 2)}`)
         res.send({...detailedTrack});
      })
   })

})

app.get('/recommend', (req, res) => {
   console.log('in recommend handler')
   let query = querystring.stringify({...req.query});
   let options = {
      url: `https://api.spotify.com/v1/recommendations?${query}`,
      headers: { Authorization: 'Bearer ' + req.accessToken },
      json: true
   }
   

   // NOTE: might need later?
   // delete req.query.access_token;
   

   request.get(options, (error, response, body) => {
      let tracks = body.tracks;
      let featuresQuery = querystring.stringify({ids: body.tracks.map(track => track.id)})
      let featuresOptions = {
         url: `https://api.spotify.com/v1/audio-features?${featuresQuery}`,
         headers: { Authorization: 'Bearer ' + req.accessToken },
         json: true  
      }
      
      request.get(featuresOptions, (fErr, fRes, fBody) => {
         tracks.forEach((track, idx) =>  {
            track = {...track, ...fBody.audio_features[idx]}
            addDetails([track])
         })
         addImgSrc(tracks, 'track')

         console.log('before send recommend')
         res.send(tracks)
         console.log('after send recommend')
      })

      
      // make call to track features
   })
})

app.listen(PORT, () => {
   console.log(`listening on port ${PORT}`);
});
