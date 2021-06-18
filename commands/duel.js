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
                        //! yes

                        return duel(message, opponent, bet);
                    
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

let authorHits = 0;
let opponentHits = 0;

function duel(message, opponent, bet) {
    //! duel game

    const duelEmbed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`${opponent} принял ваш вызов!\n\n**${opponent.user.username}**, напишите: \`shoot\` что-бы выстрелить`)
        .setColor('F93A2F')
    
    let currentUser = opponent.user;

    message.channel.send(duelEmbed)
        .then(async embed => {

            if (authorHits < 3 && opponentHits < 3) {
                await step(currentUser, message, opponent, embed);
                
                if (currentUser == message.author) {
                    currentUser = opponent.user;
                } else {
                    currentUser = message.author;
                }
                

            } else {
                if (authorHits == 3) {

                    const embed = new MessageEmbed()
                        .setDescription(`**${message.author}** выиграл!\n\nПриз: ${client.emoji} **${bet}**`)
                        .setColor('00D166')
                        .setTimestamp()

                    await client.remove(opponent.id, bet, 'cash', message);
                    await client.add(message.author.id, bet, 'cash', message);

                    return message.channel.send(embed);

                } else {

                    const embed = new MessageEmbed()
                        .setDescription(`**${opponent.user}** выиграл!\n\nПриз: ${client.emoji} **${bet}**`)
                        .setColor('00D166')
                        .setTimestamp()

                    await client.remove(message.author.id, bet, 'cash', message);
                    await client.add(opponent.id, bet, 'cash', message);

                    return message.channel.send(embed);

                }
            }
            
        })
}


async function step(currentUser, message, opponent, embed) {
    let result = await shoot(currentUser, message);
        switch (result) {
            case 1: //! successfull hit
                if (currentUser == message.author) { //* if author is shooting
                    authorHits++;
                } else { //* if opponent is shooting
                    opponentHits++;
                }

                break;
            case 2: //! timed-out
                if (currentUser == message.author) { //* if author timed out

                    const embed = new MessageEmbed()
                        .setDescription(`**${message.author.username}** не успел выстрелить...\n\nПобедителем становится ${opponent.user} - получая ${client.emoji} **${bet}**`)
                        .setColor('00D166')
                        .setTimestamp()

                    await client.remove(message.author.id, bet, 'cash', message);
                    await client.add(opponent.id, bet, 'cash', message);

                    return message.channel.send(embed);

                } else { //* if opponent timed out

                    const embed = new MessageEmbed()
                        .setDescription(`**${opponent.user.username}** не успел выстрелить...\n\nПобедителем становится ${message.author} - получая ${client.emoji} **${bet}**`)
                        .setColor('00D166')
                        .setTimestamp()

                    await client.remove(opponent.id, bet, 'cash', message);
                    await client.add(message.author.id, bet, 'cash', message);

                    return message.channel.send(embed);

                }
        }
        embed.edit(
            new MessageEmbed()
                .setDescription()
                .addFields(
                    { name: message.author.username, value: `${authorHits} 🎯`, inline: true },
                    { name: opponent.user.username, value: `${opponentHits} 🎯`, inline: true },
                )
                .setColor('F93A2F')
        )
}


function shoot(user, message) {
    message.channel.awaitMessages(response => response.content == 'shoot' && response.author.id == user.id, {
        max: 1,
        time: 10000,
        errors: [ 'time' ],
    })
    .then((collected) => {
        const hit = Math.random() > 0.5; // 50% chance of hitting the opponent

        if (hit) return 1; 
        else return 0;
        
    })
    .catch(() => {
        return 2;
    });
}