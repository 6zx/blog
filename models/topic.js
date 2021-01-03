var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/test');

var topicSchema = new Schema({
    title:{
		type:String,
		default:'',
	},
	article:{
		type:String,
		default:'',
	},
	userId:{
		type:String,
	},
	userName:{
		type:String,
	},
	type:{
		type:String
	}
});

module.exports = mongoose.model('Topic', topicSchema);