const mongo = require('mongoose');

const Schema = new mongo.Schema({
	Guild: String,
	Name: String,
	Price: Number,
	Description: String,
});

module.exports = mongo.model('shop-items', Schema);