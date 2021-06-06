const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'crime',
	cooldown: 1000 * 60 * 60,
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		const coins = Math.floor(Math.random() * 2000) + 1;
		const positiveOutcome = Math.random() < 0.4; // 30% вероятность положительного исхода

		const successEmbed = new MessageEmbed()
			.setDescription(`Вы успешно совершили преступление и заработали ${client.emoji} **${coins}**`)
			.setColor('00D166')
			.setTimestamp();

		const failureEmbed = new MessageEmbed()
			.setDescription(`Вы попались и потеряли ${client.emoji} **${coins}** Может повезет в следующий раз...`)
			.setColor('F93A2F')
			.setTimestamp();

		if (positiveOutcome) {
			await client.add(message.author.id, coins, 'cash', message);
			message.channel.send(successEmbed);
		} else {
			await client.remove(message.author.id, coins, 'cash', message);
			message.channel.send(failureEmbed);
		}
	},
};
