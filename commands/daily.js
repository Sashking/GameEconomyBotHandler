const { Client, Message, MessageEmbed } = require('discord.js');
const Schema = require('../daily-rewards');

let claimedCache = [];

const clearCache = () => {
	claimedCache = [];
	setTimeout(clearCache, 1000 * 60 * 10); // clearing cache every 10 minutes
};
clearCache();

const cooldownEmbed = new MessageEmbed()
	.setDescription(`Вы уже забирали ежедневную награду за последние 24 часа!`)
	.setColor('F93A2F')
	.setTimestamp();

module.exports = {
	name: 'daily',
	aliases: ['daily-reward', 'claim-daily'],
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		if (claimedCache.includes(message.author.id)) return message.channel.send(cooldownEmbed);

		const obj = {
			Guild: message.guild.id,
			User: message.author.id,
		};

		const results = await Schema.findOne(obj);
		if (results) {
			const then = new Date(results.updatedAt).getTime();
			const now = new Date().getTime();

			const diffTime = Math.abs(now - then);
			const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

			if (diffDays <= 1) {
				claimedCache.push(message.author.id);
				return message.channel.send(cooldownEmbed);
			}
		}

		await Schema.findOneAndUpdate(obj, obj, { upsert: true, useFindAndModify: false });
		claimedCache.push(message.author.id);

		const coins = Math.floor(Math.random() * 5000) + 1;
		const receivedEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`Вы получили ${ client.emoji } **${ coins }** в качестве ежедневной награды\n*Не забудьте вернуться завтра и снова забрать ежедневную награду*`)
			.setColor('00D166')
			.setTimestamp();

		await client.add(message.author.id, coins, 'cash', message);
		message.channel.send(receivedEmbed);
	},
};
