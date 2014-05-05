var request = require('supertest'),
	chai = require('chai'),
	expect = chai.expect,
	Controller = require('../lib/controller');

var express    = require('express');

var app = express();

var homeController = new Controller({
	path : '/'
});

homeController.get('/', function(req, res, next){
	res.data.title = 'It works';
	next();
}, function (req, res) {
	res.send({title:res.data.title});
});

homeController(app);

describe('Multiple functions in a route creation tests', function () {
	describe('Request tests', function () {
		it('GET / should return 200 and {title:"It works"}', function (done) {
			request(app).get('/').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.title).equal('It works');

				done();
			});
		});
	});
});