var Controller = require('../../lib/controller');

var methodsController = new Controller({
	path : '/methods'
});

methodsController.get('/',function(req, res){
	res.send(200, {success:true});
});

methodsController.get('/:label',function(req, res){
	res.send(200, {label:req.params.label});
});

methodsController.post('/',function(req, res){
	res.send(200, {success:true});
});

methodsController.post('/:label',function(req, res){
	res.send(200, {label:req.params.label});
});

methodsController.put('/',function(req, res){
	res.send(200, {success:true});
});

methodsController.put('/:label',function(req, res){
	res.send(200, {label:req.params.label});
});

methodsController.del('/',function(req, res){
	res.send(200, {success:true});
});

methodsController.del('/:label',function(req, res){
	res.send(200, {label:req.params.label});
});

methodsController.patch('/',function(req, res){
	res.send(200, {success:true});
});

methodsController.patch('/:label',function(req, res){
	res.send(200, {label:req.params.label});
});

methodsController.options('/',function(req, res){
	res.send(200, {success:true});
});

methodsController.options('/:label',function(req, res){
	res.send(200, {label:req.params.label});
});

module.exports = methodsController;