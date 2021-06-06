const mongo = require('mongoose');

const Schema = new mongo.Schema(
	{
		Guild: String,
		User: String,
	},
	{
		timestamps: true,
	}
);

module.exports = mongo.model('daily-rewards', Schema);
