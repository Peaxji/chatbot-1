const cnf = require('../config.js');
var perms = require('../permissions.js');
const Discord = require('discord.js');
module.exports = {
    name: 'admins',
    execute(message) {
        color = 16777215;
    	title = `[${cnf.prefix}admins]`;
        text =  `**Список пользователей, которые добавлены в администраторы бота:**\n`;
		perms['root'].forEach(function(item, i, arr) {
  			text += (`\n<@${item}>`);
		});
		const embed = new Discord.RichEmbed()
                .setColor(16777215)
                .setAuthor(`[${cnf.prefix}admins]`)
                .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
                .setDescription(`${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            message.channel.send(embed);
    }
}