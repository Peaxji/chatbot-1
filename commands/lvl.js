const config = require('../config.js');
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
module.exports = {
    name: 'lvl',
    execute(message, args) {
        var text = "";
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        message.delete(5000);
        if(!member){
            var lvls = JSON.parse(fs.readFileSync('./lvls.json'));
            if(!lvls[message.author.id]){text=config.zerolvlname; lvls[message.author.id] = 0;}
            if(lvls[message.author.id]<config.onelvl) text=config.zerolvlname;
            if(lvls[message.author.id]>config.onelvl) text=config.onelvlname;
            if(lvls[message.author.id]>config.twolvl) text=config.twolvlname;
            if(lvls[message.author.id]>config.triolvl) text=config.triolvlname;
            if(lvls[message.author.id]>config.fourlvl) text=config.fourlvlname;
            if(lvls[message.author.id]>config.fivelvl) text=config.fivelvlname;
            if(lvls[message.author.id]>config.sixlvl) text=config.sixlvlname;
            if(lvls[message.author.id]>config.sevenlvl) text=config.sevenlvlname;
            if(lvls[message.author.id]>config.eightlvl) text=config.eightlvlname;
            if(lvls[message.author.id]>config.ninelvl) text=config.ninelvlname;
            if(lvls[message.author.id]>config.tenlvl) text=config.tenlvlname;
            const embed = new Discord.RichEmbed()
            .setColor('0080FF')
            .setAuthor(`[${config.prefix}lvl]`)
            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .addField("Очки", lvls[message.author.id], true)
            .addField("Звание", text, true)
            message.channel.send(embed).then(msg => msg.delete(5000));
            return;
        }else{
            var lvls = JSON.parse(fs.readFileSync('./lvls.json'));
            if(!lvls[member.id]){text=zerolvlname; lvls[message.member.id] = 0;}
            if(lvls[member.id]<config.onelvl) text=config.zerolvlname
            if(lvls[member.id]>config.onelvl) text=config.onelvlname;
            if(lvls[member.id]>config.twolvl) text=config.twolvlname;
            if(lvls[member.id]>config.triolvl) text=config.triolvlname;
            if(lvls[member.id]>config.fourlvl) text=config.fourlvlname;
            if(lvls[member.id]>config.fivelvl) text=config.fivelvlname;
            if(lvls[member.id]>config.sixlvl) text=config.sixlvlname;
            if(lvls[member.id]>config.sevenlvl) text=config.sevenlvlname;
            if(lvls[member.id]>config.eightlvl) text=config.eightlvlname;
            if(lvls[member.id]>config.ninelvl) text=config.ninelvlname;
            if(lvls[member.id]>config.tenlvl) text=config.tenlvlname;
            const embed = new Discord.RichEmbed()
            .setColor('0080FF')
            .setAuthor(`[${config.prefix}lvl]`)
            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .addField("Очки пользователя", lvls[member.id], true)
            .addField("Звание пользователя", text, true)
            message.channel.send(embed).then(msg => msg.delete(5000));
            return;
        }
    }
}