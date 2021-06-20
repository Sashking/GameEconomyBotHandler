const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'jackpot',
    aliases: ['jp'],
	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		const invalidUseEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription('Приведено недостаточно аргументов.\n\nПрименение:\n`jackpot <ставка>`')
			.setColor('F93A2F')
			.setTimestamp();

		const insufficientBalanceEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`Недостаточный баланс наличных денег!`)
            .setColor('F93A2F')
			.setTimestamp();

		if (!args[0] || isNaN(args[0])) return message.channel.send(invalidUseEmbed);

		const bet = parseInt(args[0]);

		if (await client.balance(message.author.id, 'cash', message) < bet || bet < 1) return message.channel.send(insufficientBalanceEmbed);

        //! jackpot game
        const jackpotEmbed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription('Я придумал 7 чисел от 1 до 50. Попробуйте их угадать.\nЧем больше из них вы угадаете, тем больше коэффициент!\n\nОтправляйте ваше предположение в одном сообщении через пробел в течении одной минуты\nНапример: `1 2 3 4 5 6 7`')
            .setColor('00D166')
            .addField('Ваша ставка:', `${client.emoji} ${bet}`)

        let filter = msg => msg.author.id === message.author.id
        message.channel.send(jackpotEmbed)
            .then(() => {
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60000, // wait 1 minute for a responce
                    errors: [ 'time' ]
                }).then(async msg => {
                    msg = msg.first()
                    const guesses = msg.content.trim().split(/ +/g); // array of number-guesses as it's own item

                    const invalidNumbersEmbed = new MessageEmbed()
                        .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
                        .setDescription('Укажите 7 цифр через пробел!')
                        .setColor('F93A2F')

                    if (guesses.length != 7) return msg.channel.send(invalidNumbersEmbed);

                    function randomNumber(min, max) {
                        return Math.round(Math.random() * (max - min) + min);
                    }

                    let jackpot = []
                    for (let i = 0; i < 7; i++) {
                        jackpot.push(randomNumber(1, 50));

                        if (isNaN(guesses[i])) return msg.channel.send(invalidNumbersEmbed);

                        if (parseInt(guesses[i]) > 0 && parseInt(guesses[i]) <= 50) guesses[i] = parseInt(guesses[i])
                        else return msg.channel.send(invalidNumbersEmbed);
                    }

                    let duplicateCount = 0;
                    let duplicates = guesses;

                    for (let guess = 0; guess < guesses.length; guess++) {
                        const g = guesses[guess];
                        for (let duplicate = 0; duplicate < duplicates.length; duplicate++) {
                            const d = duplicates[duplicate];
                            if (d === g && guess != duplicate) duplicateCount ++;
                        }
                    }

                    if (duplicateCount > 0) {
                        return message.channel.send(
                            new MessageEmbed()
                                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                                .setDescription('Допускаются только уникальные цифры!')
                                .setColor('F93A2F')
                        )
                    }
                    
                    let rightGuesses = [];
                    jackpot.forEach(num => { guesses.forEach(guess => { if (num === guess) rightGuesses.push(guess) }) });

                    let multiplier = 0;
                    let embedColor;
                    switch (rightGuesses.length) {
                        case 0:
                            multiplier = 0;
                            embedColor = 'F93A2F';
                            break;
                        case 1:
                            multiplier = 1.2;
                            break;
                        case 2:
                            multiplier = 1.5;
                            break;
                        case 3:
                            multiplier = 2;
                            break;
                        case 4:
                            multiplier = 3;
                            break;
                        case 5:
                            multiplier = 7;
                            break;
                        case 6:
                            multiplier = 25;
                            break;
                        case 7:
                            multiplier = 100;
                            break;
                    }
                    const winnings = Math.round( bet * multiplier );

                    const finalEmbed = new MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                        .addFields(
                            { name: 'Загаданные цифры:', value: jackpot.join(", "), inline: true },
                            { name: 'Ваши цифры:', value: guesses.join(", "), inline: true },
                            { name: 'Угаданные цифры:', value: rightGuesses.join(", "), inline: true },
                            { name: 'Ваша ставка:', value: `${client.emoji} ${bet}`, inline: true },
                            { name: 'Коэффициент:', value: `${multiplier}x`, inline: true },
                            { name: 'Выигрыш:', value: `${client.emoji} ${winnings}`, inline: true },
                        )
                        .setColor(embedColor || '00D166')
                    
                    await client.remove(message.author.id, bet, 'cash', message);
                    await client.add(message.author.id, winnings, 'cash', message);
                    msg.channel.send(finalEmbed);

                }).catch(collected => {
                    if (!collected) return message.reply('Вы не ответили в течение минуты, поэтому я отменил игру.');
                })
            })
	},
};
