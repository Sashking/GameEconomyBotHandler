const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'work',
	cooldown: 1000 * 60,
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		const jobs = [
			'программистом',
			'строителем',
			'официантом',
			'водителем автобуса',
			'поваром',
			'механиком',
			'доктором',
		];
		const jobIndex = Math.floor(Math.random() * jobs.length);
		const coins = Math.floor(Math.random() * 200) + 1;
		
		const workEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`Вы поработали **${jobs[jobIndex]}** и заработали ${client.emoji} **${coins}**`)
			.setColor('00D166')
			.setTimestamp();

		await client.add(message.author.id, coins, 'cash', message);
		message.channel.send(workEmbed);
	},
};
