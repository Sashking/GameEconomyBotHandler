const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'pay',
	aliases: ['give', 'donate', 'transfer', 'give-money', 'pay-money'],
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		const invalidUseEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription('Приведено недостаточно аргументов.\n\nПрименение:\n`pay <участник> <сумма>`')
			.setColor('F93A2F')
			.setTimestamp();

		const insufficientBalanceEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`Недостаточный баланс наличных денег!`)
			.setColor('F93A2F')
			.setTimestamp();

		const payYourselfEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`Переводить деньги себе нельзя!`)
			.setColor('F93A2F')
			.setTimestamp();
		
		const minimalAmountEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`Минимальная сумма перевода составляет - ${client.emoji} 1`)
			.setColor('F93A2F')
			.setTimestamp();

		const user = message.mentions.users.first();

		if (!user || !args[1] || isNaN(args[1]))
			return message.channel.send(invalidUseEmbed);

		if (user.id == message.author.id)
			return message.channel.send(payYourselfEmbed);

		const amount = parseInt(args[1]);

		const successEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`${message.author} переведено ${client.emoji} **${amount}** - ${user}`)
			.setColor('00D166')
			.setTimestamp();

		if (amount < 1) return message.channel.send(minimalAmountEmbed);
		if ((await client.balance(message.author.id, 'cash', message)) < amount) return message.channel.send(insufficientBalanceEmbed);

		await client.remove(message.author.id, amount, 'cash', message);
		await client.add(user.id, amount, 'cash', message);

		message.channel.send(successEmbed);
	},
};
