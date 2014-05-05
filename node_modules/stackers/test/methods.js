var request = require('supertest'),
	chai = require('chai'),
	expect = chai.expect;

var app = require('./app/app');

describe('Methods tests', function () {
	describe('GET tests', function () {
		it('GET /methods/ should return 200 and {success:true}', function (done) {
			request(app).get('/methods/').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.success).equal(true);

				done();
			});
		});

		it('GET /methods/:label should return 200 and {label:ping}', function (done) {
			request(app).get('/methods/ping').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.label).equal('ping');

				done();
			});
		});

		it('GET /methods/:label should return 200 and {label:pong}', function (done) {
			request(app).get('/methods/pong').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.label).equal('pong');

				done();
			});
		});
	});

	describe('POST tests', function () {
		it('POST /methods/ should return 200 and {success:true}', function (done) {
			request(app).post('/methods/').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.success).equal(true);

				done();
			});
		});

		it('POST /methods/:label should return 200 and {label:ping}', function (done) {
			request(app).post('/methods/ping').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.label).equal('ping');

				done();
			});
		});

		it('POST /methods/:label should return 200 and {label:pong}', function (done) {
			request(app).post('/methods/pong').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.label).equal('pong');

				done();
			});
		});
	});

	describe('PUT tests', function () {
		it('PUT /methods/ should return 200 and {success:true}', function (done) {
			request(app).put('/methods/').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.success).equal(true);

				done();
			});
		});

		it('PUT /methods/:label should return 200 and {label:ping}', function (done) {
			request(app).put('/methods/ping').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.label).equal('ping');

				done();
			});
		});

		it('PUT /methods/:label should return 200 and {label:pong}', function (done) {
			request(app).put('/methods/pong').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.label).equal('pong');

				done();
			});
		});
	});

	describe('DELETE tests', function () {
		it('DELETE /methods/ should return 200 and {success:true}', function (done) {
			request(app).del('/methods/').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.success).equal(true);

				done();
			});
		});

		it('DELETE /methods/:label should return 200 and {label:ping}', function (done) {
			request(app).del('/methods/ping').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.label).equal('ping');

				done();
			});
		});

		it('DELETE /methods/:label should return 200 and {label:pong}', function (done) {
			request(app).del('/methods/pong').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.label).equal('pong');

				done();
			});
		});
	});

	describe('PATCH tests', function () {
		it('PATCH /methods/ should return 200 and {success:true}', function (done) {
			request(app).patch('/methods/').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.success).equal(true);

				done();
			});
		});

		it('PATCH /methods/:label should return 200 and {label:ping}', function (done) {
			request(app).patch('/methods/ping').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.label).equal('ping');

				done();
			});
		});

		it('PATCH /methods/:label should return 200 and {label:pong}', function (done) {
			request(app).patch('/methods/pong').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.label).equal('pong');

				done();
			});
		});
	});

	describe('OPTIONS tests', function () {
		it('OPTIONS /methods/ should return 200 and {success:true}', function (done) {
			request(app).options('/methods/').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.success).equal(true);

				done();
			});
		});

		it('OPTIONS /methods/:label should return 200 and {label:ping}', function (done) {
			request(app).options('/methods/ping').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.label).equal('ping');

				done();
			});
		});

		it('OPTIONS /methods/:label should return 200 and {label:pong}', function (done) {
			request(app).options('/methods/pong').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(res.body.label).equal('pong');

				done();
			});
		});
	});
});