var perms = require('../permissions.js');
const config = require('../config.js');
const Discord = require('discord.js');
const language = require('../language.json');
const client = new Discord.Client();
module.exports = {
    name: 'rainbow',
    execute(message, args, client){
        member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}rainbow]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
            if(!args[0]){
                color = 16711680;
                title = `[${config.prefix}rainbow]`;
                text = `Вы не упомянули пользователя!`;
                message.channel.send(infomessage(color, title, text));
                return;
            }else{
                let role = client.guilds.get(config.serverid).roles.find('name', config.rainbowroles).id;
                member.removeRole(role);
                member.addRole(role);
                color = 16729856;
                title = `[${config.prefix}rainbow]`;
                text = `Радужная роль была убрана или же выдана пользователю ${member}!`;
                message.channel.send(infomessage(color, title, text));
                return;
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