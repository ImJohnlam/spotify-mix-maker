const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000

const clientURL = process.env.CLIENT_URL || 'http://localhost:3001';

require('dotenv').config();
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

app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/client', require('./routes/client.js'));
app.use('/api/user', require('./routes/user.js'));

app.get('/*', function (req, res) {
   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
 });

app.listen(PORT, () => {
   console.log(`Listening on port ${PORT}`);
});
