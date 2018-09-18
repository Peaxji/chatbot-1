const config = require('../config.js');
const Discord = require('discord.js');
module.exports = {
    name:'leavemessage',
    execute(client, member) {
        if(config.channellogonoff == 'on'){
            var channel = client.guilds.get(config.serverid).channels.find('name', config.channellog);
            const embed = new Discord.RichEmbed()
                .setAuthor(`${member.user.username}#${member.user.discriminator}`, member.user.avatarURL)
                .setColor(16777215)
                .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
                .setDescription(`Пользователь вышел с сервера.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            channel.send(embed);
        }
    }
}