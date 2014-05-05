var Controller = require('../../lib/controller');

var homeController = new Controller({
	path : '/home'
});

homeController.get('/', function (req, res) {
	res.render('main',{title:'Home'});
});

var subController = require('./subController');

homeController.attach(subController);

module.exports = homeController;