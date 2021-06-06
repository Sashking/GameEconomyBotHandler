const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'withdraw',
	aliases: ['with'],
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		const invalidUseEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription('Приведено недостаточно аргументов.\n\nПрименение:\n`withdraw <сумма>`')
			.setColor('F93A2F')
			.setTimestamp();

		const insufficientBalanceEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`Недостаточный баланс в банке!`)
            .setColor('F93A2F')
			.setTimestamp();

		const successEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`Снял ${client.emoji} **${args[0]}**`)
			.setColor('00D166')
			.setTimestamp();
		
		const minimalAmountEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`Минимальная сумма вывода - ${client.emoji} 1`)
            .setColor('F93A2F')
			.setTimestamp();

		if (isNaN(args[0])) {
			return message.channel.send(invalidUseEmbed);
		} else if ((await client.balance(message.author.id, 'bank', message)) < parseInt(args[0])) {
			return message.channel.send(insufficientBalanceEmbed);
		} else if (parseInt(args[0]) < 1) {
			return message.channel.send(minimalAmountEmbed);
		} else {
			const amount = parseInt(args[0]);
			await client.remove(message.author.id, amount, 'bank', message);
			await client.add(message.author.id, amount, 'cash', message);
			message.channel.send(successEmbed);
		}
	},
};
