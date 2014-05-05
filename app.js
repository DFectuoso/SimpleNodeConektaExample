'use strict';
var express  = require('express.io'),
	// _        = require('underscore'),
	swig     = require('swig'),
	passport = require('passport'),
	flash = require('connect-flash');

// Load conf
var conf = require('./conf');
console.log('Running app.js in', conf.env, 'environment');

var app = express();

// Connects with db and load models
var db = require('./lib/db');
db.loadModels(['user']);

// Static assets
app.use(express.static('./public'));

// Template engine
var swigHelpers = require('./views/helpers');
swigHelpers(swig);

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);

// Swig cache for production
if (conf.env === 'production') {
	console.log('Adding cache to templates', conf.env);
	swig.setDefaults({ cache: 'memory' });
} else {
	swig.setDefaults({ cache: false });
}

// Add session to the app
var RedisStore = require('connect-redis')(express);

app.configure(function () {
	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.session({
		store: new RedisStore(conf.redis.options),
		secret: conf.redis.secret
	}));

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
});

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

app.get('/', function (req, res) {
	res.render('home/index');
});

// Controllers
var loginController = require('./controllers/login');
var appController = require('./controllers/app');

loginController(app);
appController(app);

app.listen(3000);