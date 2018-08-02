/*we required express and all depencies for shooping cart using npm */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');

var session = require('express-session'); //session was requires in order to store the cart on existing session 
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');

var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var app = express();

mongoose.connect('mongodb://localhost:27017/shopping', { useNewUrlParser: true }); //Conect to local data base Mongo DB
require('./config/passport');


// we use handle bars (html), bodyParser, logger dev, cockie parser,json parser,URl, view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator()); /*validator of a session*/

/*store of the session*/
app.use(cookieParser());
app.use(session({
  secret:"bellmedia", 
  resave:false, 
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection:mongoose.connection }),
  cookie:{ maxAge: 180 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

//router to routes/index.js

app.use('/', routes);

// catch 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// development Error Handle
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//500 production error handler from server

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//export all module 

module.exports = app;
