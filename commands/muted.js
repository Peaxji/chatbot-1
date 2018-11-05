const fs = require('fs');
const cnf = require('../config.js');
const Discord = require('discord.js');
const ms = require('ms');
module.exports = {
    name: 'muted',
    description: 'Muted!',
    execute(message, args) {
        var text = '';
        var mutedlist = JSON.parse(fs.readFileSync('muted.json'));
        for (var key in mutedlist) {
            text += `\nПользователь <@${key}> сидит ещё ${ms(mutedlist[key])}`;
        }
        if(!text){
            const embed = new Discord.RichEmbed()
                .setColor(5504768)
                .setAuthor(`[${cnf.prefix}muted]`)
                .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
                .setDescription(`Пользователей в муте нет!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            message.channel.send(embed);
        } else {
            text = `${text}`;
            const embed = new Discord.RichEmbed()
                .setColor(5504768)
                .setAuthor(`[${cnf.prefix}muted]`)
                .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
                .setDescription(`${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            message.channel.send(embed);
        }
    },
};
