//! imports
const { Collection, Client, Intents } = require('discord.js');

const fs = require('fs');
const config = require('./config.json');
const MoneySchema = require('./money-schema');


//! intents
const intents = new Intents();
intents.add(Intents.ALL)
const client = new Client({ ws: { intents: intents } });


//! mongo
const mongo = require('mongoose');
mongo.connect('mongodb+srv://sashking:OYfFJXybLD3Yegdw@cluster0.2myku.mongodb.net/data', { useUnifiedTopology: true, useNewUrlParser: true, })
	.then(console.log('💾  Подключен к MongoDB!'));

module.exports = client;


//! client variables
client.emoji = config.emoji;
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync('./commands/');
['command'].forEach((handler) => { require(`./handlers/${handler}`)(client) });

client.balance = (id, type, message) => 
	new Promise(async (ful) => {
		const data = await MoneySchema.findOne({ Guild: message.guild.id, ID: id });
		if (!data) return ful(0);
		if (type == 'cash') ful(data.Cash);
		else if (type == 'bank') ful(data.Bank);
});

client.add = (id, amount, type, message) => {
	MoneySchema.findOne({ Guild: message.guild.id, ID: id }, async (err, data) => {
		if (err) throw err;
		if (data) {
			if (type == 'cash') data.Cash += amount;
			else if (type == 'bank') data.Bank += amount;
		} else {
			if (type == 'cash') {
				data = new MoneySchema({
					Guild: message.guild.id,
					ID: id,
					Cash: amount,
					Bank: 0,
				});
			} else if (type == 'bank') {
				data = new MoneySchema({
					Guild: message.guild.id,
					ID: id,
					Cash: 0,
					Bank: amount,
				});
			}
		}
		data.save();
	});
};

client.remove = (id, amount, type, message) => {
	MoneySchema.findOne({ Guild: message.guild.id, ID: id }, async (err, data) => {
		if (err) throw err;
		if (data) {
			if (type == 'cash') data.Cash -= amount;
			else if (type == 'bank') data.Bank -= amount;
		} else {
			if (type == 'cash') {
				data = new MoneySchema({
					Guild: message.guild.id,
					ID: id,
					Cash: -amount,
					Bank: 0,
				});
			} else if (type == 'bank') {
				data = new MoneySchema({
					Guild: message.guild.id,
					ID: id,
					Cash: 0,
					Bank: -amount,
				});
			}
		}
		data.save();
	});
};


client.login(config.token);