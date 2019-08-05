// Modules
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

const path = require('path');
const passport = require('passport');
const morgan = require('morgan');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
const session = require('express-session');
var okta = require("@okta/okta-sdk-nodejs");
var ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;


//starts express
var app = express();

// okta configs
var oktaClient = new okta.Client({
    orgUrl: 'https://dev-543119.okta.com',
    token: '00FWj8iu34A5192znyOHxEpQhrsIIj3ddxuQ4ssSkS'
});

const oidc = new ExpressOIDC({
    issuer: "https://dev-543119.okta.com/oauth2/default",
    client_id: "0oa129ra9cyIDY1hq357",
    client_secret: "7gATp3gpz7XndgJhBT5BJXAmLT4IXopDeYMcgDO3",
    redirect_uri: 'http://localhost:7676/app',
    scope: "openid profile",
    routes: {
      login: {
        path: "/login"
      },
      callback: {
        path: "/app",
        defaultRedirect: "/app"
      }
    }
});

app.use(session({
    secret: 'asdf;lkjh3lkjh235l23h5l235kjh',
    resave: true,
    saveUninitialized: false
}));

app.use(oidc.router);

app.use((req, res, next) => {
    if (!req.userinfo) {
      return next();
    }
  
    oktaClient.getUser(req.userinfo.sub)
      .then(user => {
        req.user = user;
        res.locals.user = user;
        next();
      }).catch(err => {
        next(err);
      });
  });

function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }

  next();
}

// load config file
var config = require('./app/config.json');

// Create server
var server = http.createServer(app).listen(config.port, config.address);
console.log("Server running on http://" + config.address + ":" + config.port);

// Require and configure socket.io
var io = require('socket.io')(server);

// Parse application/json
app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Serve up static assests
app.use(express.static(__dirname + '/public'));

// Set pug as view engine
app.set('view engine', 'pug');
//app.set('views', __dirname + '/public/views');

// Routes
require('./app/routes')(loginRequired,app);

// IO
require('./app/io')(io);

// Expose app
exports = module.exports = app;
