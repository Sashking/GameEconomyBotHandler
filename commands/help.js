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
			//? main (bank) commands
			{
				name: '` balance (участник) `',
				value: `показывает ваш баланс или баланс указанного пользователя`,
				inline: true,
			},
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
			//? make-money commands
			{
				name: '` work `',
				value: `позволяет получить деньги, работая`,
				inline: true,
			},
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
			//? shop system
			{
				name: '` shop `',
				value: `показывает все предметы в магазине`,
				inline: true,
			},
			{
				name: '` item-create `',
				value: `(только администраторы) интерактивное создание нового предмета`,
				inline: true,
			},
			{
				name: '` item-delete `',
				value: `(только администраторы) интерактивное удаление предмета`,
				inline: true,
			},
			//? other ways of making money
			{
				name: '` pay <участник> <сумма> `',
				value: `перевости определенную сумму денег другому пользователю`,
				inline: true,
			},
			{
				name: '` duel <ставка> <участник> `',
				value: `вызовите участника на дуель`,
				inline: true,
			},
			{
				name: '` jackpot <ставка> `',
				value: `испытайте удачу и посторайтесь отгадать как можно больше цифр`,
				inline: true,
			},
			//? admin commands
			{
				name: '` giveaway <сумма> <время> `',
				value: `(только администраторы) позволяет проводить розыгрыш валюты`,
				inline: true,
			},
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
			//? informative commands
			{
				name: '` leaderboard `',
				value: `10 лучших игроков на сервере`,
				inline: true,
			},
			{
				name: '` help `',
				value: `список всех команд`,
				inline: true,
			},
			{
				name: '` ping `',
				value: `присылает пинг бота`,
				inline: true,
			},
            //? other
            {
                name: '` daily `',
                value: `забрать свою ежедневную награду`,
                inline: true,
            },
		);
		helpEmbed.setColor('F8C300');
		helpEmbed.setTimestamp();
		helpEmbed.addField('** **', '*` <> ` необходимые аргументы\n` [] ` необходимые аргументы из выбора\n` () ` не обязательные аргументы*');

		message.channel.send(helpEmbed);
	},
};
