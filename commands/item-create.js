const { Client, Message, MessageEmbed } = require('discord.js');
const Schema = require('../shop-items');

module.exports = {
	name: 'item-create',
	aliases: [ 'create-item', 'item-new', 'new-item', 'add-item', 'item-add' ],
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		if (!message.member.hasPermission('ADMINISTRATOR')) return;

		/**
		 * A: #item-create
		 * B: Пожалуйста, введите имя для нового продукта.
		 * A: Apple
		 * B: Please enter price of **Apple**
		 * A: 500
		 * B: Please provide description for **Apple**.
		 * A: Just a normal source of food.
		 * B: Created new item!
		*/ 

		let itemName = '';
		let itemPrice = 0;
		let itemDesc = '';

		//! NAME
		let filter = msg => msg.author.id === message.author.id;
		message.channel.send(
			new MessageEmbed()
				.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
				.setDescription(`Пожалуйста, введите **название** нового продукта`)
				.setColor('0099E1')
				.setFooter('Чтобы отменить это действие, напишите cancel')
			).then(() => {
				message.channel.awaitMessages(filter, {
					max: 1,
					time: 30000,
					errors: ['time']
				}).then(message => {
					message = message.first()
					if (message.content === 'cancel') return message.channel.send(`Отмена действия.`);
					itemName = message.content;

					//! PRICE
					let filter = msg => msg.author.id === message.author.id && !isNaN(msg.content)
					message.channel.send(
						new MessageEmbed()
							.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
							.setDescription(`Пожалуйста, введите **стоимость** нового продукта`)
							.setColor('0099E1')
							.setFooter('Чтобы отменить это действие, напишите cancel')
						).then(() => {
							message.channel.awaitMessages(filter, {
								max: 1,
								time: 30000,
								errors: ['time']
							}).then(message => {
								message = message.first()
								if (message.content === 'cancel') return message.channel.send(`Отмена действия.`);
								itemPrice = parseInt(message.content);

								//! DESCRIPTION
								let filter = msg => msg.author.id === message.author.id;
								message.channel.send(
									new MessageEmbed()
										.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
										.setDescription(`Пожалуйста, введите **описание** нового продукта`)
										.setColor('0099E1')
										.setFooter('Чтобы отменить это действие, напишите cancel')
									).then(() => {
										message.channel.awaitMessages(filter, {
											max: 1,
											time: 30000,
											errors: ['time']
										}).then(message => {
											message = message.first()
											if (message.content === 'cancel') return message.channel.send(`Отмена действия.`);
											itemDesc = message.content;

											//! Adding item into the database
											new Schema({
												Guild: message.guild.id,
												Name: itemName,
												Price: itemPrice,
												Description: itemDesc,
											}).save().then(() => {

												const successEmbed = new MessageEmbed()
												.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
												.setDescription(`Создан новый продукт: **${itemName}**`)
												.setColor('00D166')
												.setTimestamp();
											
												return message.channel.send(successEmbed);

											})
										})

										//! Desc timeout
										.catch(collected => { if (!collected) return message.channel.send('Вы не ответили вовремя - отменяю действие.'); });
									})
							})
							//! Price timeout
							.catch(collected => { if (!collected) return message.channel.send('Вы не ответили вовремя - отменяю действие.'); });
						})
				})
				//! Name Timeout
				.catch(collected => { if (!collected) return message.channel.send('Вы не ответили вовремя - отменяю действие.'); });
		})
	},
};