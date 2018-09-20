const Discord = require('discord.js');
const config = require('../config.js');
module.exports = {
    name: 'report',
    execute(message, args) {
        let user = message.guild.member(message.mentions.users.first());
        if(!user){
            color = 16711680;
            title = `[${config.prefix}report]`;
            text = `Вы не упомянули пользователя и не написали причину !report @user [reason]`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        var replace = /\[(.*?)\]/ism;
        var reportuser = replace.exec(message.content);
        if(!reportuser){
            color = 16711680;
            title = `[${config.prefix}report]`;
            text = `Вы не написали причину !report @user [reason]`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        channel = message.guild.channels.find('name', config.reportchannel);
        const embed = new Discord.RichEmbed()
            .setColor(13632027)
            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .addField("Нарушитель", `<@${user.id}>`)
            .addField("Канал", `${message.channel}`)
            .addField("Отправитель", `<@${message.author.id}>`)
            .addField("Текст репорта", `**${reportuser[1]}**\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            channel.send(embed);
            message.reply(`ваша жалоба на пользователя отправлена! Ваше сообщение с командой ${config.prefix}report было удалено.`);
            message.delete(message.author.id);
    }
}
function infomessage(color, title, text) {
    const embed = new Discord.RichEmbed()
        .setColor(color)
        .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
        .addField(title, `${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
    return embed;
}