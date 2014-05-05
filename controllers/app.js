'use strict';
var controller = require('stackers'),
		superagent = require ('superagent'),
  	db = require('../lib/db');

var User = db.model('user');

var appController = controller({
	path : '/app'
});


appController.get('/', function (req, res) {
	res.render('app/index');
});

appController.post('/', function (req, res) {
	superagent
	  .post('https://api.conekta.io/charges')
		.auth('PRIVATE_API_KEY', '')
		.set('Content-type', 'application/json')
		.set('Accept', 'application/vnd.conekta-v0.3.0+json')
	  .send({
			description: 'Buying Item with id:001',
			amount: 500 * 100,
			currency: 'MXN',
			reference_id: '0001',// Este deberia de ser un id de la transaccion interna
			card: req.body.conektaTokenId
		 })
	  .end(function(error, conektaRes){
			if(error) return res.send(500,err);

			req.conektaId = conektaRes.body.id;
			req.conektaStatus = conektaRes.body.status;
			req.conektaPaidAt = conektaRes.body.paid_at;
			req.conektaFee = conektaRes.body.fee;

			res.render('app/transaction', req);
	  });
});

module.exports = appController;
