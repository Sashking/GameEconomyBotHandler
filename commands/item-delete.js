const { Client, Message, MessageEmbed } = require('discord.js');
const Schema = require('../shop-items');

module.exports = {
	name: 'item-delete',
	aliases: [ 'delete-item', 'remove-item', 'item-remove' ],
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		if (!message.member.hasPermission('ADMINISTRATOR')) return;

		/**
		 * A: #item-delete
		 * B: Пожалуйста, введите имя продукта.
		 * A: Apple
		 * B: Deleted item!
		*/ 

		let itemName = '';

		let filter = msg => msg.author.id === message.author.id;
		message.channel.send(
			new MessageEmbed()
				.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
				.setDescription(`Пожалуйста, введите название продукта, который хотите удалить`)
				.setColor('0099E1')
				.setFooter('Чтобы отменить это действие, напишите cancel')
			).then(() => {
				message.channel.awaitMessages(filter, {
					max: 1,
					time: 30000,
					errors: ['time']
				}).then(msg => {
					msg = msg.first()
					if (msg.content === 'cancel') return message.channel.send(`Отмена действия.`);
					itemName = msg.content;

                    Schema.findOne({ Guild: message.guild.id, Name: itemName }, async (err, data) => {
                        if (data) {
                            await Schema.findOneAndDelete({ Guild: message.guild.id, Name: itemName });

                            message.channel.send(
                                new MessageEmbed()
                                    .setDescription(`Предмет **${itemName}** удалён`)
                                    .setColor('00D166')
                                    .setTimestamp()
                            );
                        } else {
                            return message.channel.send(
                                new MessageEmbed()
                                    .setDescription(`Предмет **${itemName}** не найден`)
                                    .setColor('F93A2F')
                                    .setTimestamp()
                            );
                        }
                    })
				})
				//! Timeout
				.catch(collected => { if (!collected) return message.channel.send('Вы не ответили вовремя - отменяю действие.'); });
		})
	},
};