var request = require('supertest'),
	chai = require('chai'),
	expect = chai.expect,
	Controller = require('../lib/controller');

var express    = require('express');

var app = express();

var homeController = new Controller({
	path : '/main'
});

Controller.beforeEach(function (req, res, next) {
	res.data.global = true;

	next();
});

homeController.beforeEach(function(req, res, next){
	res.data.main = true;
	next();
});

var subController = new Controller({
	path : '/sub'
});

subController.beforeEach(function(req, res, next){
	if(res.data.main){
		res.data.sub = true;
	}

	next();
});

subController.get('/test', function(req, res){
	res.send(res.data);
});

homeController.get('/test', function(req, res){
	res.send(res.data);
});

homeController.attach(subController);
homeController(app);

describe('multiple beforeEachs, from diferent controllers', function () {
	describe('Request tests', function () {
		it('GET /main/sub/test should return 200 and with main, sub and global', function (done) {
			request(app).get('/main/sub/test').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.main).equal(true);
				expect(res.body.sub).equal(true);
				expect(res.body.global).equal(true);

				done();
			});
		});

		it('GET /main/test should return 200 and with main and global', function (done) {
			request(app).get('/main/test').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.main).equal(true);
				expect(res.body.global).equal(true);

				done();
			});
		});
	});
});