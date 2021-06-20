const { Client, Message, MessageEmbed } = require('discord.js');
const Schema = require('../shop-items');

module.exports = {
    name: 'buy',
    aliases: [ 'buy-item', 'item-buy' ],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {

        /**
		 * A: #buy Apple
		 * B: Bought Apple!
		*/

        let itemName = args.join(" ");

        if (!itemName) {
            return message.channel.send(
                new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription('Приведено недостаточно аргументов.\n\nПрименение:\n`buy <название>`')
                    .setColor('F93A2F')
                    .setTimestamp()
            )
        }

        await Schema.findOne({ Guild: message.guild.id, Name: itemName }, async (err, data) => {
            if (data) {
                const successEmbed = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`Успешно куплен предмет **${itemName}**`)
                    .setColor('00D166')
                    .setTimestamp()
                
                if (data.Role) {
                    if (message.guild.roles.cache.get(data.Role).position < message.guild.members.resolve(client.user).roles.highest.position) {
                        message.member.roles.add(message.guild.roles.cache.get(data.Role));
                    } else {
                        return message.channel.send(
                            new MessageEmbed()
                                .setDescription(`Ошибка! \n\nПереместите мою роль выше чем роль ${data.Name}, чтобы я мог её выдавать!`)
                                .setColor('F93A2F')
                                .setTimestamp()
                        )
                    }
                }
                
                if (await client.balance(message.author.id, 'cash', message) < data.Price) {
                    const notEnoughMoneyEmbed = new MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`Не достаточно наличных денег, что-бы купить **${itemName}**`)
                        .setColor('F93A2F')
                        .setTimestamp()
                    return message.channel.send(notEnoughMoneyEmbed);
                }
                
                client.remove(message.author.id, data.Price, 'cash', message);
                message.channel.send(successEmbed)
            } else {
                const itemNotFoundEmbed = new MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`Предмет **${itemName}** не найден`)
                        .setColor('F93A2F')
                        .setTimestamp()
                return message.channel.send(itemNotFoundEmbed);
            }
        })
    }
}