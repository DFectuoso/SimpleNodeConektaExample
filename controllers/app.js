'use strict';
var controller = require('stackers'),
	db = require('../lib/db');

var User = db.model('user');

var appController = controller({
	path : '/app'
});

appController.beforeEach(function (req, res, next) {
	if (!(req.session.passport && req.session.passport.user)) {
		return res.redirect('/');
	}

	var id = db.Types.ObjectId(req.session.passport.user.id);
	User.findOne({_id: id}, function (err, user) {
		if (!user) {
			return res.redirect('/');
		}
		res.data.user = user;
		res.user = user;

		next();
	});
});

appController.get('', function (req, res) {
	res.render('app/index');
});

module.exports = appController;