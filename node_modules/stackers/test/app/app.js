var express    = require('express'),
    swig       = require('swig'),
    Controller = require('../../lib/controller');

var app = express();

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', './test/app/views');

var	methodsController = require('./methodsController');
var	homeController = require('./homeController');


homeController.beforeEach(function (req, res, next) {
	res.data.user = {
		username : 'siedrix',
		password : 'some secret'
	};

	next();
});

homeController.use(Controller.utils.asJsonFilter('user', ['username']));
homeController.beforeRender(Controller.utils.asJson);

methodsController(app);
homeController(app);

module.exports = app;