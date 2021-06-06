const mongo = require('mongoose');

const Schema = new mongo.Schema({
	Guild: String,
	ID: String,
	Cash: Number,
	Bank: Number,
});

module.exports = mongo.model('money', Schema);