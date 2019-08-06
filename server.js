// Modules
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require('./app/passport')(passport);

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

app.use(morgan('dev'))
app.use(cookieParser());
app.use(session({
    secret: 'alskd;13çla9sd4;123',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
require('./app/routes')(app, passport);

// static files
app.use(express.static(path.join(__dirname, 'public')));

// IO
require('./app/io')(io);

// Expose app
exports = module.exports = app;
