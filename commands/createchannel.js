const config = require('../config.js');
const Discord = require('discord.js');
module.exports = {
    name:'createchannel',
    execute(client, channel) {
        if(config.channellogonoff == 'on'){
            var channel = client.guilds.get(config.serverid).channels.find('name', config.channellog);
            const embed = new Discord.RichEmbed()
                .setAuthor(`Создание канала ${channel.name}`)
                .setColor(16777215)
                .setFooter("Coder - cheesega. Version: 2.9", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
                .setDescription(`Был создан канал **${channel.name}**. Его тип: ${channel.type}.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            channel.send(embed);
        }
    }
}