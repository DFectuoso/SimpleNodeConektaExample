var request = require('supertest'),
	chai = require('chai'),
	expect = chai.expect;

var app = require('./app/app');

var homeController = require('./app/homeController');
var subController = require('./app/subController');

describe('Subcontroller tests', function () {
	describe('Attach tests', function () {
		it('Should have attach function', function () {
			expect(typeof homeController.attach).equal('function');
		});
	});

	describe('Request tests', function () {
		it('GET /home/sub/ should return 200 and {success:true}', function (done) {
			request(app).get('/home/sub/').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.success).equal(true);

				done();
			});
		});

		it('POST /home/sub/ should return 200 and {success:true}', function (done) {
			request(app).post('/home/sub/').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.success).equal(true);

				done();
			});
		});

		it('PUT /home/sub/ should return 200 and {success:true}', function (done) {
			request(app).put('/home/sub/').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.success).equal(true);

				done();
			});
		});
	});
});