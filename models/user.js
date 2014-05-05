var db = require('../lib/db'),
	schema = db.Schema;

var userSchema = schema({
	displayName : {type : String},
	username    : {type : String, required : true, lowercase: true},
	password    : {type : String, required : true}
});

var User = db.model('user', userSchema);

module.exports = User;