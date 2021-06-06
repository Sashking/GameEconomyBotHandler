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
            message.channel.send(
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
                        
                        //! duel game
                        const duelEmbed = new MessageEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                            .setDescription(`${opponent} принял ваш вызов!\n\n**${opponent.user.username}**, напишите: \`shoot\` что-бы выстрелить`)
                            .setColor('F93A2F')
                        
                        message.channel.send(duelEmbed)
                            .then(embed => {
                                let authorHP = 100;
                                let opponentHP = 100;
                                let isAuthor = false;

                                message.channel.awaitMessages(response => response.content == 'shoot' && response.author.id == isAuthor ? message.author.id : opponent.user.id, {
                                    max: 1,
                                    time: 10000,
                                    errors: [ 'time' ],
                                })
                                .then((collected) => {
                                    const damage = Math.floor(Math.random() * 27) + 20;

                                    if (isAuthor) opponentHP -= damage;
                                    else if (!isAuthor) authorHP -= damage;

                                    isAuthor = !isAuthor;
                                    message.channel.send(`**${isAuthor ? message.author.username : opponent.user.username}** нанёс **${damage}** урона. ${isAuthor ? opponent.user : message.author}, ваш ход!`);

                                    embed.edit(
                                        new MessageEmbed()
                                            .addFields(
                                                { name: message.author.username, value: `${authorHP} ❤`, inline: true },
                                                { name: opponent.user.username, value: `${opponentHP} ❤`, inline: true },
                                            )
                                            .setColor('F93A2F')
                                    )
                                })
                                .catch(() => {
                                    message.channel.send(`Конец.`);
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
