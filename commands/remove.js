const { Client, Message, MessageEmbed, User } = require('discord.js');

module.exports = {
	name: 'remove',
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		if (!message.member.hasPermission('ADMINISTRATOR')) return;

		const invalidUseEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription('Приведено недостаточно аргументов.\n\nПрименение:\n`remove <участник> [cash | bank] <сумма>`')
			.setColor('F93A2F')
			.setTimestamp();

		const member = message.mentions.members.first();
		const type = args[1];
		const amount = args[2];

		if (!member || !type || isNaN(parseInt(amount))) return message.channel.send(invalidUseEmbed);

		if (type == 'cash' || type == 'bank') {
			await client.remove(member.id, parseInt(amount), type, message);

			const successEmbed = new MessageEmbed()
				.setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
				.setDescription(`Убрано ${client.emoji} ${amount} ${member}`)
				.setColor('00D166')
				.setTimestamp()

			message.channel.send(successEmbed);

		} else {
			return message.channel.send(invalidUseEmbed); 
		}
	},
};
