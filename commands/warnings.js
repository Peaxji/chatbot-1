const config = require('../config.js');
const Discord = require('discord.js');
const fs = require('fs');
var infobanlist = JSON.parse(fs.readFileSync('infoban.json'));
module.exports = {
    name:'warnings',
    execute(message, args) {
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!member){
            if(!infobanlist[message.author.id]){
                color = 16777215;
                title = `[${config.prefix}warnings]`;
                text = `У вас  **0** предупреждений(я/е)!`;
                message.channel.send(infomessage(color, title, text));
            return;
            }
            color = 16777215;
            title = `[${config.prefix}warnings]`;
            text = `У вас  **${infobanlist[message.author.id]}** предупреждений(я/е)!`;
            message.channel.send(infomessage(color, title, text));
            return;
        }else{
            if(!infobanlist[member.id]){
                color = 16777215;
            title = `[${config.prefix}warnings]`;
            text = `У пользователя ${member},  **0** предупреждений(я/е)!`;
            message.channel.send(infomessage(color, title, text));
            return;
            }
            color = 16777215;
            title = `[${config.prefix}warnings]`;
            text = `У пользователя ${member},  **${infobanlist[member.id]}** предупреждений(я/е)!`;
            message.channel.send(infomessage(color, title, text));
        }
    }
}
function infomessage(color, title, text) {
    const embed = new Discord.RichEmbed()
        .setColor(color)
        .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
        .addField(title, `${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
    return embed;
}