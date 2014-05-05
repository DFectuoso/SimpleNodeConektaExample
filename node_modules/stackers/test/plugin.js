var request = require('supertest'),
	chai = require('chai'),
	expect = chai.expect;

var app = require('./app/app');
var Controller = require('../lib/controller');

var _ = require('underscore');

var basicPlugIn = function(){
	this.basicPlugInAdded = true;
};

var basicGlobalPlugIn = function(){
	this.basicGlobalPlugIn = true;
};

Controller.use(basicGlobalPlugIn);

var controller = new Controller();

controller.use(basicPlugIn);
controller.use(Controller.utils.asJsonFilter('user', ['username']));
controller.use(Controller.utils.asJsonFilter('extra-filter', ['something else']));

describe('Plug in tests', function () {
	describe('controller object modifications', function(){
		it('Should have a basicPlugInAdded property', function(){
			expect(controller.basicPlugInAdded).equal(true);
		});

		it('Should have a basicGlobalPlugIn property', function(){
			expect(controller.basicGlobalPlugIn).equal(true);
		});

		it('Should have a _jsonFilters array with to items', function(){
			expect( _.isArray(controller._jsonFilters) ).equal(true);
			expect( controller._jsonFilters.length ).equal(2);
		});
	});

	describe('render as json', function () {
		it('Shouldnt show user password', function (done) {
			request(app).get('/home/?asJson=true').end(function (req, res) {
				expect(res.statusCode).equal(200);
				expect(typeof res.body.user).equal('object');
				expect(res.body.user.username).equal('siedrix');
				expect(res.body.user.password).equal(undefined);

				done();
			});
		});
	});
});