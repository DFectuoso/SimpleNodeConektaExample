var request = require('supertest'),
	chai = require('chai'),
	expect = chai.expect;

var app = require('./app/app');

console.log('Render tests')

describe('Render tests', function () {
	describe('simple render', function () {
		it('should return main template with home in h1', function (done) {
			request(app).get('/home/').end(function (req, res) {
				expect(res.body).equal('<html><head></head><body><h1>Home</h1></body></html>');

				done();
			});
		});
	});

	// describe('render as json', function () {
		
	// });
});