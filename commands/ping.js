const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ping',
	aliases: ['p'],
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		const msg = await message.channel.send(`🏓 Пинг...`);
		const embed = new MessageEmbed()
			.setTitle('🏓 Понг!')
			.setDescription(`Пинг WebSocketa ${ client.ws.ping }мс\nПинг редактирования сообщения ${ Math.floor(msg.createdAt - message.createdAt) }мс`)
			.setColor('F93A2F');
		await message.channel.send(embed);
		msg.delete();
	},
};
