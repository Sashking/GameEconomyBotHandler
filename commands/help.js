const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const prefix = require('../config.json').prefix;

module.exports = {
	name: 'help',
	aliases: ['h'],
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		const helpEmbed = new MessageEmbed();
		helpEmbed.setAuthor(
			message.author.tag,
			message.author.displayAvatarURL({ dynamic: true })
		);
		helpEmbed.addFields(
			{
				name: '` balance (участник) `',
				value: `показывает ваш баланс или баланс указанного пользователя`,
				inline: true,
			},
			{
				name: '` leaderboard `',
				value: `10 лучших игроков на сервере`,
				inline: true,
			},
			// {
			// 	name: '** **',
			// 	value: '** **',
			// },
			{
				name: '` withdraw <сумма> `',
				value: `снятие денег из банка`,
				inline: true,
			},
			{
				name: '` deposit <сумма> `',
				value: `внос денег в банк`,
				inline: true,
			},
			// {
			// 	name: '** **',
			// 	value: '** **',
			// },
			{
				name: '` work `',
				value: `позволяет получить деньги, работая`,
				inline: true,
			},
			{
				name: '` daily `',
				value: `забрать свою ежедневную награду`,
				inline: true,
			},
			// {
			// 	name: '** **',
			// 	value: '** **',
			// },
			{
				name: '` crime `',
				value: `рискованно, но награда стоит того`,
				inline: true,
			},
			{
				name: '` rob <участник> `',
				value: `позволяет воровать деньги у других пользователей`,
				inline: true
			},
			// {
			// 	name: '** **',
			// 	value: '** **',
			// },
			{
				name: '` jackpot <ставка> `',
				value: `испытайте удачу и посторайтесь отгадать как можно больше цифр`,
				inline: true,
			},
			{
				name: '` pay <участник> <сумма> `',
				value: `перевости определенную сумму денег другому пользователю`,
				inline: true,
			},
			// {
			// 	name: '** **',
			// 	value: '** **',
			// },
			{
				name: '` giveaway <сумма> <время> `',
				value: `(только администраторы) позволяет проводить розыгрыш валюты`,
				inline: true,
			},
			{
				name: '` duel <ставка> <участник> `',
				value: `--`,
				inline: true,
			},
			// {
			// 	name: '** **',
			// 	value: '** **',
			// },
			{
				name: '` add <участник> [cash | bank] <сумма> `',
				value: `(только администраторы) добавляет указанную сумму денег выбранному пользователю`,
				inline: true,
			},
			{
				name: '` remove <участник> [cash | bank] <сумма> `',
				value: `(только администраторы) удаляет указанную сумму денег у указанного пользователя`,
				inline: true,
			},
			// {
			// 	name: '** **',
			// 	value: '** **',
			// },
			{
				name: '` help `',
				value: `список всех команд`,
				inline: true,
			},
			{
				name: '` ping `',
				value: `присылает пинг бота`,
				inline: true,
			}
		);
		helpEmbed.setColor('F8C300');
		helpEmbed.setTimestamp();

		message.channel.send(helpEmbed);
	},
};
