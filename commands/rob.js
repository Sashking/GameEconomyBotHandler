const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'rob',
    cooldown: 1000 * 60 * 60,
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		const invalidUseEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription('Приведено недостаточно аргументов.\n\nПрименение:\n`rob <участник>`')
			.setColor('F93A2F')
			.setTimestamp();

		const user = message.mentions.members.first();

        if (!user) return message.channel.send(invalidUseEmbed);

		if (user.id === message.author.id) {
			return message.channel.send(
                new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`Вы не можете ограбить самого себя!`)
                    .setColor('F93A2F')
			        .setTimestamp()
            )
		}

		const coins = await client.balance(user.id, 'cash', message);
		const robSuccesful = Math.random() < 0.5;

		const winEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`Поздравляю! Вы успешно ограбили **${user}** и получили ${client.emoji} ${coins}`)
			.setColor('00D166')
			.setTimestamp();

		const lossEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`Вас поймали при ограблении ${user}. И теперь придется платить ${client.emoji} ${coins}`)
			.setColor('F93A2F')
			.setTimestamp();

		const noMoneyInCashEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`Вы пытались ограбить пользователя ${user}, но у него не было денег.`)
			.setColor('F93A2F')
			.setTimestamp();

		if (client.balance(user.id, 'cash', message) < 1) return message.channel.send(noMoneyInCashEmbed);

		if (robSuccesful) {
            await client.remove(user.id, coins, 'cash', message);
			await client.add(message.author.id, coins, 'cash', message);
			message.channel.send(winEmbed);
		} else {
			await client.remove(message.author.id, Math.floor(coins / 2), 'cash', message);
            await client.add(user.id, Math.floor(coins / 2), 'cash', message);
			message.channel.send(lossEmbed);
		}
	},
};
