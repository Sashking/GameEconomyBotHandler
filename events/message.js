const { Collection, MessageEmbed } = require('discord.js');
const cooldownCollection = new Collection();
const client = require('../index');
const prefix = require('../config.json').prefix;
const ms = require('ms');

client.on('message', async (message) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;
	if (!message.guild) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();

	if (cmd.length == 0) return;
	let command = client.commands.get(cmd);
	if (!command) command = client.commands.get(client.aliases.get(cmd));
	if (command) {
		if (command.cooldown) {
			if (cooldownCollection.has(`${ command.name }${ message.author.id }${ message.guild.id }`)) {
				const cooldownEmbed = new MessageEmbed()
					.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
					.setDescription(`Вы не можете использовать эту команду в течение \`${ ms(cooldownCollection.get(`${ command.name }${ message.author.id }${ message.guild.id }`) - Date.now(), { long: false, }) }\``)
					.setColor('F93A2F')
					.setTimestamp();
				return message.channel.send(cooldownEmbed);
			}
			command.run(client, message, args);
			cooldownCollection.set(`${ command.name }${ message.author.id }${ message.guild.id }`, Date.now() + command.cooldown);
			setTimeout(() => { cooldownCollection.delete(`${ command.name }${ message.author.id }${ message.guild.id }`); }, command.cooldown);
		} else command.run(client, message, args);
	}
});
