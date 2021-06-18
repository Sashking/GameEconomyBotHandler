const { Client, Message, MessageEmbed } = require('discord.js');
const Schema = require('../shop-items');

module.exports = {
    name: 'shop',
    aliases: [ 'store', 'items' ],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        let items = [];

        await Schema.find({ Guild: message.guild.id }, (err, data) => {
            data.map(item => {
                    let itemName = item.Name;
                    let itemPrice = item.Price;
                    let itemDesc = item.Description;

                    let obj = new Object({
                        name: `${itemName} - ${client.emoji} ${itemPrice}`,
                        value: `*${itemDesc}*`,
                        inline: true,
                    });

                    items.push(obj);
                })

                const storeEmbed = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`Купите товар с помощью \`buy <предмет>\``)
                    .addFields(items)
                    .setColor('F8C300')
                    .setTimestamp()
                
                message.channel.send(storeEmbed);
        })
    }
}