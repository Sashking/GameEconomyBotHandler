const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'duel',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        //! duel 1000 @sashking

        const invalidUseEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription('Приведено недостаточно аргументов.\n\nПрименение:\n`duel <сумма> <участник>`')
			.setColor('F93A2F')
			.setTimestamp();
        
        const minimalAmountEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`Минимальная сумма ставки составляет: ${client.emoji} 1`)
			.setColor('F93A2F')
			.setTimestamp();

        let bet = args[0];
        const opponent = message.mentions.members.first();

        if (!bet || !opponent) return message.channel.send(invalidUseEmbed);
        if (isNaN(bet)) return message.channel.send(invalidUseEmbed);
        if (parseInt(bet) < 1) return message.channel.send(minimalAmountEmbed);

        bet = parseInt(args[0]);

        if (opponent.id === message.author.id) {
            return message.channel.send(
                new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`Вы не можете играть с самим собой!`)
                    .setColor('F93A2F')
			        .setTimestamp()
            )
        }

        if (bet > await client.balance(message.author.id, 'cash', message)) {
            return message.channel.send(
                new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`У вас нету столько наличных денег!`)
                    .setColor('F93A2F')
			        .setTimestamp()
            )
        }

        if (bet > await client.balance(opponent.id, 'cash', message)) {
            return message.channel.send(
                new MessageEmbed()
                    .setAuthor(opponent.user.tag, opponent.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`У вашего противника нету столько наличных денег!`)
                    .setColor('F93A2F')
                    .setTimestamp()
            )
        }

        const requestEmbed = new MessageEmbed()
            .setDescription(`**${message.author.username}** бросил вам вызов на дуэль. Вы принимаете его вызов? (yes/no)`)
            .setColor('00D166')
            .setTimestamp();

        message.channel.send(opponent, requestEmbed)
            .then(() => {
                message.channel.awaitMessages(response => response.content == 'yes' && response.author.id == opponent.id || response.content == 'no' && response.author.id == opponent.id, {
                    max: 1,
                    time: 60000,
                    errors: [ 'time' ],
                })
                .then((collected) => {
                    if (collected.first().content == 'yes') {
                        //! yes
                        const gameEmbed = new MessageEmbed()
                            .setTitle(`\`${message.author.username}\` vs \`${opponent.user.username}\``)
                            .setDescription(`*Напишите слово \`shoot\` больше раз чем ваш противник! У вас есть 10 секунд*`)
                            .setColor('F8C300')
                            .setTimestamp()

                        message.channel.send(gameEmbed)
                            .then(() => {
                                const filter = m => m.author.id === message.author.id && m.content === "shoot" || m.author.id === opponent.user.id && m.content === "shoot";
                                const collector = message.channel.createMessageCollector(filter, { time: 10000 });

                                let authorPoints = 0;
                                let opponentPoints = 0;

                                collector.on('collect', m => {
                                    if (m.author.id === message.author.id) {
                                        authorPoints++;
                                    } else if (m.author.id === opponent.user.id) {
                                        opponentPoints++;
                                    }
                                });
                                
                                collector.on('end', async collected => {
                                    // if author won
                                    if (authorPoints > opponentPoints) {
                                        await client.remove(opponent.user.id, bet, 'cash', message);
                                        await client.add(message.author.id, bet, 'cash', message);

                                        message.channel.send(
                                            new MessageEmbed()
                                                .setDescription(`${message.author} победил (${authorPoints} балла/ов) над **${opponent.user.username}** (${opponentPoints} балла/ов)\n\n+ ${client.emoji} ${bet}`)
                                                .setColor('A652BB')
                                                .setTimestamp()
                                        )
                                    // if opponent won
                                    } else if (opponentPoints > authorPoints) {
                                        await client.remove(message.author.id, bet, 'cash', message);
                                        await client.add(opponent.user.id, bet, 'cash', message);

                                        message.channel.send(
                                            new MessageEmbed()
                                                .setDescription(`${opponent.user} победил (${opponentPoints} балла/ов) над **${message.author.username}** (${authorPoints} балла/ов)\n\n+ ${client.emoji} ${bet}`)
                                                .setColor('A652BB')
                                                .setTimestamp()
                                        )
                                    // if it is a tie 
                                    } else {
                                        message.channel.send(
                                            new MessageEmbed()
                                                .setDescription(`Ничья 🤷‍♂️\n\n+ ${client.emoji} 0`)
                                                .setColor('FD0061')
                                                .setTimestamp()
                                        )
                                    }
                                });
                            })
                    
                    } else if(collected.first().content == 'no') {
                        return message.channel.send(
                            new MessageEmbed()
                                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                                .setDescription(`${opponent} отклонил ваш вызов!`)
                                .setColor('F93A2F')
                                .setTimestamp()
                        );
                    }
                })
                .catch(() => {
                    message.channel.send(`Нет ответа. Бой отменен.`);
                });
            });
    }
}