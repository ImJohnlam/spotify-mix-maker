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

app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(cookieParser());

if (process.env.NODE_ENV === 'production')
	app.use(express.static('client/build'));

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

// all in one handler
/*
app.get('/search', (req, res) => {
   const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
         grant_type: 'client_credentials'
      },
      headers: {
         Authorization: 'Basic ' + (new Buffer(creds.client_id + ':' + creds.client_secret).toString('base64'))
      }
   };

   request.post(authOptions, (tokErr, tokRes, tokBody) => {
      let authObj = JSON.parse(tokBody);
      let accessToken = authObj.access_token;
      console.log(`1 accessing api, accessToken=${accessToken}`);
      let options = {
         url: 'https://api.spotify.com/v1/search?q=mac%20miller&type=artist',
         headers: { Authorization: 'Bearer ' + accessToken },
         json: true
      };
      request.get(options, (sErr, sRes, sBody) => {
         console.log(JSON.stringify(sBody, null, 2))
         sBody.artists.items.forEach((item) => console.log(item.name))
         res.send(sBody)
      })
   })
})
*/

//also use this for recommend
// get client credentials and attach to req body
app.use((req, res, next) => {
   if (req.path === '/search' || req.path === '/top') {
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

// 
app.get('/search', (req, res) => {
   let options = {
      url: 'https://api.spotify.com/v1/search' + url.parse(req.url,true).search,
      headers: { Authorization: 'Bearer ' + req.accessToken },
      json: true
   };
   request.get(options, (sErr, sRes, sBody) => {
      console.log(JSON.stringify(sBody, null, 2))
      sBody.artists.items.forEach((item) => console.log(item.name))
      res.json(sBody)
      console.log(req.query)
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
      fields: 'items(track(name, artists(name)))'
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
