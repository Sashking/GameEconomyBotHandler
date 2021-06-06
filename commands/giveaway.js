const { Client, Message, MessageEmbed } = require('discord.js');
const ms = require('ms');
const moment = require('moment');

module.exports = {
    name: 'giveaway',
    aliases: ['ga'],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        //! giveaway #channel 💶100 7d

        if (!message.member.hasPermission('MANAGE_MESSAGES')) return;

        const channel = message.mentions.channels.first();
        const amount = parseInt(args[1]) || 0;
        let time = 1;

        const invalidUseEmbed = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
			.setDescription('Приведено недостаточно аргументов.\n\nПрименение:\n`giveaway <канал> <сумма> <время>`')
			.setColor('F93A2F')
			.setTimestamp();
        if (!channel || !amount || !time) return message.channel.send(invalidUseEmbed)

        for (let i = 2; i < args.length; i++) {
            const arg = args[i];
            time += ms(arg)
        }

        if (!time) return message.channel.send(invalidUseEmbed);

        let d = moment() + time;
        let n = moment(d).format('HH:MM, DD.MM.YYYY');
        
        const embed = new MessageEmbed()
            .setTitle(`🎉 Розыгрыш на ${client.emoji} ${amount}`)
            .addFields(
                { name: 'Победитель:', value: '---', inline: true },
                { name: 'Время:', value: ms(time), inline: true },
                { name: 'Итоги в:', value: n, inline: true },
            )
            .setColor('A652BB')
        channel.send(embed)
        .then(msg => {
            setTimeout(async function() {
                let winner = await getWinner();
                while (winner.user.bot) {
                    winner = await getWinner();
                }
    
                const winnerEmber = new MessageEmbed()
                    .setTitle(`🎉 Розыгрыш на ${client.emoji} ${amount}`)
                    .addFields(
                        { name: 'Победитель:', value: winner, inline: true },
                        { name: 'Время:', value: ms(time), inline: true },
                        { name: 'Итоги в:', value: n, inline: true },
                    )
                    .setColor('FD0061')
    
                client.add(winner.id, amount, 'cash', message);
                msg.edit(winnerEmber);
            }, time)
        })

        function getWinner() {
            const winner = message.guild.members.cache.random();
            return winner;
        }
    }
}