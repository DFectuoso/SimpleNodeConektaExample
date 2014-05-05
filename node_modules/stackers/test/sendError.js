var request = require('supertest'),
	chai = require('chai'),
	expect = chai.expect,
	Controller = require('../lib/controller'),
	fs = require('fs');

var express    = require('express');

var app = express();
var errors = [];

Controller.on('error', function (statusCode, error) {
	error.statusCode = statusCode;

	errors.push(error);
});

var homeController = new Controller({
	path : '/main'
});

homeController.get('/500', function (req, res) {
	res.sendError(500, {error:'Something bad happend'});
});

homeController.get('/404', function (req, res) {
	res.sendError(404, {error:'Not found'});
});

homeController.get('/403', function (req, res) {
	res.sendError(403, {error:'Forbiden'});
});

homeController.get('/undefined-function', function () {
	foo.bar();
});

homeController.get('/random-error-code', function (req, res) {
	res.sendError(420, 'Random error');
});

Controller.errorHandler(404, function (res) {
	fs.readFile('./test/app/views/404.html', function (err, data) {
		res.send(404, data);
	});
});

Controller.errorHandler(403, function (res) {
	fs.readFile('./test/app/views/403.html', function (err, data) {
		res.send(403, data);
	});
});

Controller.errorHandler(500, function (res) {
	fs.readFile('./test/app/views/500.html', function (err, data) {
		res.send(500, data);
	});
});

Controller.errorHandler(function (res, statusCode) {
	fs.readFile('./test/app/views/generic.html', function (err, data) {
		res.send(statusCode, data);
	});
});

homeController(app);

app.use(Controller.utils.errorHandler );
app.all('*', Controller.utils.undefinedRouteHandler(Controller) );

app.listen(3000);

describe('sendError and errorHandler', function () {
	before(function () {
		errors = [];
	});

	describe('Request tests', function () {
		it('GET /main/404 should return 404 and error Not found', function (done) {
			request(app).get('/main/404').end(function (req, res) {
				expect(res.statusCode).equal(404);
				expect(res.body.error).equal('Not found');

				done();
			});
		});

		it('GET /main/403 should return 403 and error Forbiden', function (done) {
			request(app).get('/main/403').end(function (req, res) {
				expect(res.statusCode).equal(403);
				expect(res.body.error).equal('Forbiden');

				done();
			});
		});

		it('GET /main/500 should return 500 and error Something bad happend', function (done) {
			request(app).get('/main/500').end(function (req, res) {
				expect(res.statusCode).equal(500);
				expect(res.body.error).equal('Something bad happend');

				done();
			});
		});

		it('GET /main/undefined-function should return 500 and error Something bad happend', function (done) {
			request(app).get('/main/undefined-function').end(function (req, res) {
				expect(res.statusCode).equal(500);
				expect(res.body.error).equal('ReferenceError: foo is not defined');

				done();
			});
		});

		it('GET /main/undefined-route should return 404 and error Not found', function (done) {
			request(app).get('/main/undefined-route').end(function (req, res) {
				expect(res.statusCode).equal(404);
				expect(res.body.error).equal('Not found');

				done();
			});
		});

		it('GET /main/random-error-code should return 420 and error Random error', function (done) {
			request(app).get('/main/random-error-code').end(function (req, res) {
				expect(res.statusCode).equal(420);
				expect(res.body.error).equal('Random error');

				done();
			});
		});

	});

	describe('Log tests', function () {
		it('There have to be 6 errors logged', function () {
			expect(errors.length).equal(6);

			expect(errors[0]).deep.equal({statusCode: 404, error: 'Not found' });
			expect(errors[1]).deep.equal({statusCode: 403, error: 'Forbiden' });
			expect(errors[2]).deep.equal({statusCode: 500, error: 'Something bad happend' });
			expect(errors[3]).deep.equal({statusCode: 500, error: 'ReferenceError: foo is not defined' });
			expect(errors[4]).deep.equal({statusCode: 404, error: 'Not found' });
			expect(errors[5]).deep.equal({statusCode: 420, error: 'Random error' });
		});
	});

	describe('Production errors', function () {
		before(function () {
			Controller.conf({env:'production'});
		});

		it('GET /main/404 should return 404 and nice 404 template', function (done) {
			request(app).get('/main/404').end(function (req, res) {
				expect(res.statusCode).equal(404);
				expect(res.text).equal('<!doctype html><html><head></head><body><h1>404</h1></body></html>');

				done();
			});
		});

		it('GET /main/403 should return 403 and nice 403 template', function (done) {
			request(app).get('/main/403').end(function (req, res) {
				expect(res.statusCode).equal(403);
				expect(res.text).equal('<!doctype html><html><head></head><body><h1>403</h1></body></html>');

				done();
			});
		});

		it('GET /main/500 should return 500 and nice 500 template', function (done) {
			request(app).get('/main/500').end(function (req, res) {
				expect(res.statusCode).equal(500);
				expect(res.text).equal('<!doctype html><html><head></head><body><h1>500</h1></body></html>');

				done();
			});
		});

		it('GET /main/undefined-function should return 500 and error Something bad happend', function (done) {
			request(app).get('/main/undefined-function').end(function (req, res) {
				expect(res.statusCode).equal(500);
				expect(res.text).equal('<!doctype html><html><head></head><body><h1>500</h1></body></html>');

				done();
			});
		});

		it('GET /main/undefined-route should return 404 and nice 404 template', function (done) {
			request(app).get('/main/undefined-route').end(function (req, res) {
				expect(res.statusCode).equal(404);
				expect(res.text).equal('<!doctype html><html><head></head><body><h1>404</h1></body></html>');

				done();
			});
		});

		it('GET /main/random-error-code should return 420 and nice generic error template', function (done) {
			request(app).get('/main/random-error-code').end(function (req, res) {
				expect(res.statusCode).equal(420);
				expect(res.text).equal('<!doctype html><html><head></head><body><h1>Some error</h1></body></html>');

				done();
			});
		});
	});

	after(function () {
		errors = [];
	});
});
