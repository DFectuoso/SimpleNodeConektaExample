var _ = require('underscore'),
	async = require('async'),
	EventEmitter = require('events').EventEmitter;

var ee = new EventEmitter();

var _beforeEach = [];
var _plugins = [];

var Controller = function(config){
	config = config || {};

	var verbs = ['get','post', 'put', 'del', 'patch', 'options'];

	var self = function (server) {
		self._beforeEach = self._beforeEach.concat(_.clone(_beforeEach));

		verbs.forEach(function(verb) {
			self._routes[verb].forEach(function (routeArgs) {
				// cast arguments to array
				var callStack =  Array.prototype.slice.call(routeArgs, 0);

				callStack[0] = callStack[0].replace(/\/+/g, '/');

				callStack.splice(1,0,function (req,res,next) {
					req._params = self._params;

					next();
				});

				callStack.splice(callStack.length === 3 ? 2 : 3 ,0,function (req,res,next) {
					var paralelFns = {};

					_.each(req._params, function (item, key) {
						if(key, req.params[key]){
							paralelFns[key] = function (done){
								item(req.params[key], done);
							};
						}
					});

					async.parallel(paralelFns, function (err, results) {
						if(err){return res.sendError(500,err);}

						var notFound = [];
						_.each(results, function (item, key) {
							if(!item){return notFound.push(key + ' not found');}
							res.data[key.replace('Id', '')] = item;
						});

						if(notFound.length){return res.sendError(404,notFound);}

						next();
					});
				});

				self._beforeEach.forEach(function (fn, i) {
					callStack.splice(1 + i, 0, fn);
				});


				server[verb].apply(server, callStack);
			});
		});
	};

	self.isController = true;

	self.use = function (fn) {
		fn.call(this);
	};

	// global plug-ins
	_plugins.forEach(function (fn) {
		fn.call(self);
	});

	self.attach = function (subcontroller) {
		if( !subcontroller.isController ){
			throw 'cant attach non Controller objects';
		}

		subcontroller._beforeEach.shift();

		verbs.forEach(function(verb) {
			subcontroller._routes[verb].forEach(function (routeArgs) {
				routeArgs[0] = '/' + self.path + routeArgs[0];

				var callStack =  Array.prototype.slice.call(routeArgs, 0);

				subcontroller._beforeEach.forEach(function (fn) {
					callStack.splice(1,0,fn);
				});

				callStack.splice(1,0,function (req,res,next) {
					if(req._params){
						req._params = _.extend(req._params, subcontroller._params);
					}else{
						req._params = subcontroller._params;
					}

					next();
				});

				self._routes[verb].push(callStack);
			});
		});
	};

	self._routes = {};
	verbs.forEach(function(verb) {
		self._routes[verb] = [];

		self[verb] = function () {
			var args = arguments;
			args[0] = '/' + self.path + arguments[0];

			self._routes[verb].push(args);
		};
	});

	self._beforeEach = [];
	self._params = {};

	// Modify render to add res.data to be pass from middleware to the view
	self._beforeEach.push(function(req, res, next){
		res.data = {};

		res._render = res.render;
		res.render = function(view, data){
			data = data || {};
			data.layout = self._layout;
			data = _.extend(data, res.data);

			res.data = data;

			var fns = _.map(self._beforeRender, function (fn) {
				return function(done){
					fn.apply(self, [req, res, done]);
				};
			});

			async.series(fns, function (err) {
				if(err) return res.send(500, err);
				res._render(view, data);
			});
		};

		Controller.extendResponse(res);

		next();
	});



	self._beforeEach = self._beforeEach.concat(_.clone(_beforeEach));

	self._beforeRender = [];
	self.beforeRender = function(fn){
		self._beforeRender.push(fn);
	};

	self.beforeEach = function (fn) {
		self._beforeEach.push(fn);
	};

	self.config = function(config){
		this.path = config.path || '';
	};

	self.param = function (paramName, fn) {
		self._params[paramName] = fn;
	};

	self.config(config);

	return self;
};

Controller.utils = require('./utils');
Controller.beforeEach = function (fn) {
	_beforeEach.push(fn);
};

Controller.use = function (fn) {
	_plugins.push(fn);
};

Controller.on = function (event, fn) {
	ee.on(event, fn);
};

Controller._conf = {};
Controller.conf = function (conf) {
	if(typeof conf === 'string'){
		return this._conf[conf];
	}else{
		this._conf = _.extend(this._conf, conf);
	}
};

var _errorHandlers = {};
Controller.errorHandler = function (statusCode, fn) {
	if(!fn){
		fn = statusCode;
		statusCode = 'generic';
	}

	_errorHandlers[statusCode] = fn;
};

Controller.extendResponse = function (res) {
	res.sendError = function (statusCode, err) {
		if(typeof err === 'string'){
			err = {error:err};
		}

		var handler;
		ee.emit('error', statusCode, err);

		if(_errorHandlers[statusCode]){handler = _errorHandlers[statusCode];}
		else if(_errorHandlers.generic){handler = _errorHandlers.generic;}
		
		if(Controller.conf('env') === 'production' && handler){
			handler(res, statusCode);
		}else{
			res.send(statusCode, err);
		}
	};
};

module.exports = Controller;