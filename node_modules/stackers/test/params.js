var request = require('supertest'),
	chai = require('chai'),
	expect = chai.expect,
	Controller = require('../lib/controller');

var express  = require('express');
var app = express();

var homeController = new Controller({
	path : '/main'
});

homeController.param('userId', function (userId, done) {
	if(userId === '1'){
		done(null, {username: 'test'});
	}else if(userId === '2'){
		console.log('Resolving with error');
		done({error: 'something went wrong'});
	}else{
		done();
	}
});

homeController.param('itemId', function (itemId, done) {
	done(null, {item: true});
});

var subController = new Controller({
	path : '/sub'
});

subController.param('otherId', function (otherId, done) {
	if(otherId === '1'){
		done(null, {name: 'test'});
	}else if(otherId === '2'){
		done({error: 'something went wrong'});
	}else{
		done();
	}
});

subController.param('itemId', function (itemId, done) {
	done(null, {item: true});
});

homeController.get('/user/:userId', function (req, res) {
	res.send(res.data);
});

subController.get('/other/:otherId', function (req, res) {
	res.send(res.data);
});

subController.get('/multi/:userId/:otherId', function (req, res) {
	res.send(res.data);
});

subController.get('/overwrite/:itemId', function (req, res) {
	res.send(res.data);
});

homeController.attach(subController);
homeController(app);

describe('Params', function () {
	describe('Single params url', function () {
		it('GET /main/user/1 should return 200 and with user', function (done) {
			request(app).get('/main/user/1').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.user).deep.equal({username: 'test'});

				done();
			});
		});

		it('GET /main/sub/other/2 should return 200 and with user', function (done) {
			request(app).get('/main/sub/other/1').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.other).deep.equal({name: 'test'});

				done();
			});
		});
	});

	describe('Multiple params in url', function () {
		it('GET /main/sub/multi/1/1 should return 200 and with user and other', function (done) {
			request(app).get('/main/sub/multi/1/1').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.user).deep.equal({username: 'test'});
				expect(res.body.other).deep.equal({name: 'test'});

				done();
			});
		});
	});

	describe('overwrite params', function () {
		it('GET /main/sub/overwrite/1 should return 200 and with item', function (done) {
			request(app).get('/main/sub/overwrite/1').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.item).deep.equal({item: true});

				done();
			});
		});
	});

	describe('send 500 if a param is done with error', function () {
		it('GET /main/user/2 should return 500', function (done) {
			request(app).get('/main/user/2').end(function (req, res) {
				expect(res.statusCode).equal(500);

				done();
			});
		});

		it('GET /main/sub/multi/1/ should return 500', function (done) {
			request(app).get('/main/sub/multi/1/2').end(function (req, res) {
				expect(res.statusCode).equal(500);

				done();
			});
		});
	});

	describe('send 404 if a param is not returned', function () {
		it('GET /main/user/3 should return 404', function (done) {
			request(app).get('/main/user/3').end(function (req, res) {
				expect(res.statusCode).equal(404);

				done();
			});
		});

		it('GET /main/sub/multi/1/3` should return 404', function (done) {
			request(app).get('/main/sub/multi/1/3').end(function (req, res) {
				expect(res.statusCode).equal(404);

				done();
			});
		});
	});
});