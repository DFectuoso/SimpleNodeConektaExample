var request = require('supertest'),
	chai = require('chai'),
	expect = chai.expect;

var app = require('./app/app');

describe('Render tests', function () {
	describe('simple render', function () {
		it('should return main template with home in h1', function (done) {
			request(app).get('/home/').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.text).equal('<!doctype html><html><head></head><body><h1>Home</h1></body></html>');

				done();
			});
		});

		it('should return main template with ping in h1', function (done) {
			request(app).get('/home/sub/render/ping').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.text).equal('<!doctype html><html><head></head><body><h1>ping</h1></body></html>');

				done();
			});
		});

		it('should return main template with pong in h1', function (done) {
			request(app).get('/home/sub/render/pong').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.text).equal('<!doctype html><html><head></head><body><h1>pong</h1></body></html>');

				done();
			});
		});
	});

	describe('render as json', function () {
		it('should return main template with home in h1', function (done) {
			request(app).get('/home/?asJson=true').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.title).equal('Home');
				expect(typeof res.body.user).equal('object');

				done();
			});
		});

		it('should return main template with home in h1', function (done) {
			request(app).get('/home/?asJson=true').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.title).equal('Home');
				expect(typeof res.body.user).equal('object');

				done();
			});
		});
	});
});