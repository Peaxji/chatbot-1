var perms = require('../permissions.js');
const config = require('../config.js');
const language = require('../language.json');
const Discord = require('discord.js');
const fs = require('fs');
var infobanlist = JSON.parse(fs.readFileSync('infoban.json'));
const client = new Discord.Client();
module.exports = {
    name: 'rwarnings',
    execute(message, args) {
        if(perms['owner'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}rwarnings]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!member){
            color = 16777215;
            title = `[${config.prefix}rwarnings]`;
            text = `У вас удалены все предупреждения!`;
            message.channel.send(infomessage(color, title, text));
            delete infobanlist[message.author.id];
            fs.writeFile('infoban.json', JSON.stringify(infobanlist), function() {/*console.log(badwordslist);*/});
            return;
        }
        delete infobanlist[member.id];
        fs.writeFile('infoban.json', JSON.stringify(infobanlist), function() {/*console.log(badwordslist);*/});
        color = 16734464;
        title = `[${config.prefix}rwarnings]`;
        text = `Все предупреждения у пользователя ${member} удалены!`;
        message.channel.send(infomessage(color, title, text));
    }
}
function infomessage(color, title, text) {
    const embed = new Discord.RichEmbed()
        .setColor(color)
        .setFooter("Coder - cheesega. Version: 2.9", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
        .addField(title, `${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
    return embed;
}