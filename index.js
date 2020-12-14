const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000

const clientURL = process.env.CLIENT_URL || 'http://localhost:3001';

app.use(bodyParser());
app.use(cookieParser());

if (process.env.NODE_ENV === 'production')
   app.use(express.static(path.join(__dirname, 'client/build')));
else
   app.use(express.static(path.join(__dirname, 'public')));

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

app.use('/auth', require('./routes/auth.js'));
app.use('/client', require('./routes/client.js'));
app.use('/user', require('./routes/user.js'));

app.get('/*', (req, res) => {
   let url = path.join(__dirname, '../client/build', 'index.html');
   if (!url.startsWith('/app/')) // we're on local windows
     url = url.substring(1);
   res.sendFile(url);
 });

app.listen(PORT, () => {
   console.log(`Listening on port ${PORT}`);
});
