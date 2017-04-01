var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var WordSchema = new Schema({
    english: String,
    russian: String,
    description: String,
    awarenessRate: Number
});

function getConn() {
    return mongoose.createConnection('mongodb://localhost/dictionaryapp');
}

module.exports = function (router) {
    router.get('/dictionary', function (req, res) {

        var Word = mongoose.model('Word', WordSchema);
        var newword = new Word();


        res.json({ res: 'укпыукрыкерке' });
    });

    router.get('/flashcards', function (req, res) {
        res.json({ res: 'укпыукрыкерке' });
    });
}