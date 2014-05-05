var Controller = require('../../lib/controller');

var subController = new Controller({
	path : '/sub'
});

subController.get('/',function(req, res){
	res.send(200, {success:true});
});

subController.get('/render/:label',function(req, res){
	res.render('main',{title:req.params.label});
});

subController.post('/',function(req, res){
	res.send(200, {success:true});
});

subController.put('/',function(req, res){
	res.send(200, {success:true});
});

module.exports = subController;