var perms = require('../permissions.js');
const config = require('../config.js');
const language = require('../language.json');
const Discord = require('discord.js');
const fs = require('fs');
var lvls = JSON.parse(fs.readFileSync('./lvls.json'));
module.exports = {
    name: 'setlvl',
    execute(message, args) {
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}setlvl]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        if(!args[0]){
            color = 16711680;
            title = `[${config.prefix}setlvl]`;
            text = `Вы не упомянули пользователя!`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        if(!args[1]){
            color = 16711680;
            title = `[${config.prefix}setlvl]`;
            text = `Введите количество очков!`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        let setvalue = parseFloat(args[1]);
        lvls[member.id]=setvalue;
        color = '00FF89';
        title = `[${config.prefix}setlvl]`;
        text = `Вы установили у пользователя ${member} количество очков: ${setvalue}!`;
        fs.writeFile('lvls.json', JSON.stringify(lvls), function() {/*console.log(whitelist);*/});
        message.channel.send(infomessage(color, title, text));
    }
}
function infomessage(color, title, text) {
    const embed = new Discord.RichEmbed()
        .setColor(color)
        .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
        .addField(title, `${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
    return embed;

}