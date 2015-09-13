// server.js

// set up constants ===============================================================
var port = process.env.PORT || 80;

var viewDirectory = "/app/dev-view";
var webRootDirectory = "/app/dev-webroot";
if (process.env.NODE_ENV === "production") {
    viewDirectory = "/app/view";
    webRootDirectory = "/app/webroot";
}

// get all the tools we need ======================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var compression = require('compression');
var config = require('./config/config');
var expressLayouts = require('express-ejs-layouts');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

// configuration ===============================================================

//connect to mongoDB
mongoose.connect(config.MONGO_URI);
mongoose.connection.on('error', function () {
    console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

// enable third pary modules ===================================================
app.use(compression());
app.use(cookieParser()); // read cookies (needed for auth)
require('./config/passport')(app, passport);

// use EJS and layout ==========================================================
app.set('view engine', 'ejs');
app.set('layout', 'defaultLayout');
app.use(expressLayouts);

// config view =================================================================
app.set('views', __dirname + viewDirectory);
app.use(express.static(__dirname + webRootDirectory));

// body parder for api and port setting ========================================
app.set('port', port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// required for session stroage in mongodb=======================================
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
        mongooseConnection: mongoose.connections[0],
        autoReconnect: true
    }),
    cookie: config.sessionCookie,
    name: config.sessionName,
    clear_interval: 60 * 60
}));
// required for passport ==========================================================
app.use(session({
    secret: config.SESSION_SECRET
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


// load all models =========================================================
var model_files, model_loc;
app.models = {};
model_loc = __dirname + '/app/model';
model_files = fs.readdirSync(model_loc);
model_files.forEach(function (file) {
    return (require(model_loc + '/' + file)).boot(app);
});

// load all controller =========================================================
var controller_loc = __dirname + '/app/controller';
var controller_files = fs.readdirSync(controller_loc);
controller_files.forEach(function (file) {
    return (require(controller_loc + '/' + file))(app);
});


// routes ======================================================================
require('./app/routes')(app);


// Force HTTPS on Heroku
/*if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}*/

// Start the Server ==============================================================
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
