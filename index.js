const express = require('express');
const request = require('request');
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


app.use(bodyParser());
app.use(cookieParser());

if (process.env.NODE_ENV === 'production')
   app.use(express.static('client/build'));
else
   app.use(express.static(__dirname + '/public'));

// app.use(cors());
app.use(function(req, res, next) {
   console.log("Handling " + req.path + '/' + req.method);
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
   if (req.path === '/me')
      req.accessToken = cryptoJS.AES.decrypt(req.query.access_token, creds.secret_key).toString(cryptoJS.enc.Utf8);
   else if (req.path === '/refresh'){
      console.log(req.query)
      console.log(`req.query.refresh_token=${req.query.refresh_token}`)
      req.refreshToken = cryptoJS.AES.decrypt(req.query.refresh_token, creds.secret_key).toString(cryptoJS.enc.Utf8);
   }

   next()
})

// TO DO: save client credentials to reuse
// get client credentials
app.use((req, res, next) => {
   if (req.path === '/search' || req.path === '/top' || '/details' || req.path === '/genres') {
      const authOptions = {
         url: 'https://accounts.spotify.com/api/token',
         form: {
            grant_type: 'client_credentials'
         },
         headers: {
            Authorization: 'Basic ' + (new Buffer(creds.client_id + ':' + creds.client_secret).toString('base64'))
         }
      };

      console.log('getting client credentials');
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


app.get('/search', (req, res) => {
   let options = {
      url: 'https://api.spotify.com/v1/search' + url.parse(req.url, true).search,
      headers: { Authorization: 'Bearer ' + req.accessToken },
      json: true
   };

   request.get(options, (sErr, sRes, sBody) => {
      console.log(JSON.stringify(sBody, null, 2))
      let results = sBody[`${req.query.type}s`].items;

      results.forEach((item) => console.log(item.name))
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
         scope: 'user-read-private user-read-email'
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
         
         res.redirect('localhost:3001')
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
         res.redirect('localhost:3001')
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
      res.json(body)
   });
})

app.get('/top', (req, res) => {
   const playlistID = '37i9dQZEVXbLRQDuF5jeBp';
   let query = querystring.stringify({
      fields: 'items(track(name, external_urls, id, artists(name), album(images)))'
   })

   let options = {
      url: `https://api.spotify.com/v1/playlists/${playlistID}/tracks?` + query,
      headers: { Authorization: 'Bearer ' + req.accessToken },
      json: true
   }
   request.get(options, (error, response, body) => {
      console.log(body)
      let playlistTracks = body.items;
      console.log('printing top')
      playlistTracks.forEach(pt => {
         console.log(JSON.stringify(pt.track, null, 2))
      })
      res.send(playlistTracks.map(pt => pt.track))
   })
})

function addDetails(track) {
   const keys = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
   const camelotNum = ((7 * track.key) + 5 + (track.mode ? 3 : 0)) % 12 || 12;
   const minutes = Math.round(track.duration_ms / 60000);
   const seconds = Math.round(track.duration_ms / 1000) % 60;
   const ratings = ['acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 'speechiness', 'valence']

   track.classical = keys[track.key] + (track.mode ? ' Major' : ' Minor');
   track.camelot = camelotNum.toString(10) + (track.mode ? 'B' : 'A')
   track.duration_min = minutes.toString(10) + ':' + (seconds < 10 ? '0' : '') + seconds.toString(10);
   track.bpm = Math.round(track.tempo);
   track.loudness = Math.round(track.loudness).toString(10) + ' dB'
   ratings.forEach(attr => track[attr] = Math.round(parseFloat(track[attr]) * 100))
}

app.get('/details/:id', (req, res) => {
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
         addDetails(detailedTrack)
         console.log(`detailedTrack=${JSON.stringify(detailedTrack, null, 2)}`)
         res.send({...detailedTrack});
      })
   })

})

app.get('/recommend', (req, res) => {
   let options = {
      url: 'https://api.spotify.com/v1/recommendations',
      headers: { Authorization: 'Bearer ' + req.accessToken },
      json: true
   }
   let query;

   delete req.query.access_token;
   query = querystring.stringify({...req.query});

   request.get(options, (error, response, body) => {
   
      // make call to track features
   })
   res.end()
})

app.listen(PORT, () => {
   console.log(`listening on port ${PORT}`);
});
