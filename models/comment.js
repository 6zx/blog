var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/test');

var commontSchema = new Schema({
    topicId: {
        type:String,
        required: true
    },
    commenterId: {
        type:String,
        required: true
    },
    commenterName: {
        type:String,
        required: true
    },
    comment: {
        type:String,
        required: true
    },
    created_time: {
        type: Date,
        default: Date.now
    },
    likenum: {
        type: Number,
        default: 0
    },
    dislikenum: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Comment', commontSchema);