__Motivations__: Build a battletested controller library that allows middleware reuse, small controllers files to build complex applications.

__Applications using it on production__: Dashboard at Geniusly.co, TheWorldPhoto.co and ChelaJs.com.

## Basic Use

To create controller create a file with:

```
var controller = require('stackers');

var homeController = controller({
    path : '/'
});

homeController.get('', function(req, res){
	res.send('');
});

module.exports = homeController;
```

To add this controller to you appliction do:
```
var express  = require('express');

var app = express();

var homeController  = require('./controllers/home');

dashboardController(homeController);

app.listen(3000);
console.log('=> App running app', new Date());
```

## Add a middleware to all controller routes
```
var controller = require('stackers');

var homeController = controller({
	path : '/'
});

homeController.beforeEach(function(req, res, next){
	res.data.hello = 'world'
	next();
});

homeController.get('', function(req, res){
	res.send(res.data.hello);
});

module.exports = homeController;
```

## Subcontrollers and reuse all the middlewares of the parent.

The subcontroller should look like this:
```
var controller = require('stackers');

var subController = controller({
	path : '/sub'
});

subController.beforeEach(function(req, res, next){
	res.data.subcontroller = 'yep'
	next();
});

subController.get('/test', function(req, res){
	res.send(res.data);
});

module.exports = userController;
```

The main controller should look like this:
```
var mainController = require('stackers');

var mainController = controller({
	path : '/main'
});

mainController.beforeEach(function(req, res, next){
	res.data.controller = 'yep'
	next();
});

var subController = require('./sub');

mainController.attach(subController);

module.exports = mainController;
```

If you curl __http://localhost:3000/main/sub/test__

you would get 

    {controller:'yep', subcontroller:'yep'}














