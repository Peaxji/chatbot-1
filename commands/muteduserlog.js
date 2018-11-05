const cnf = require('../config.js');
const Discord = require('discord.js');
module.exports = {
    name:'logmute',
    execute(client, user, mutetime, reason, mod) {
        var channel = client.guilds.get(cnf.serverid).channels.find('name', cnf.channellog);
            const embed = new Discord.RichEmbed()
                .setAuthor(`Замутен пользователь`)
                .setColor(16777215)
                .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
                .setDescription(`Пользователь ${user} попал в мут на ${mutetime}.\nПричина: ${reason}.\nМодератор: ${mod}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            channel.send(embed);
        }
    }