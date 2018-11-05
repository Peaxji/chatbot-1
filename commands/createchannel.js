const cnf = require('../config.js');
const Discord = require('discord.js');
module.exports = {
    name:'createchannel',
    execute(client, channel) {
        if(cnf.channellogonoff == 'on'){
            var channels = client.guilds.get(cnf.serverid).channels.find('name', cnf.channellog);
            if(channel.name == cnf.channellog) return;
            const embed = new Discord.RichEmbed()
                .setAuthor(`Создание канала ${channel.name}`)
                .setColor(16777215)
                .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
                .setDescription(`Был создан канал **${channel.name}**. Его тип: ${channel.type}.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            channels.send(embed);
        }
    }
}