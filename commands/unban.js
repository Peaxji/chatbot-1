var perms = require('../permissions.js');
const config = require('../config.js');
const language = require('../language.json');
const Discord = require('discord.js');
module.exports = {
    name: 'unban',
    execute(message, args) {
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}unban]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        const user = args[0];
        if(!args[0]){
            color = 16711680;
            title = `[${config.prefix}unban]`;
            text = `Используйте ${config.prefix}ban @user`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        message.guild.unban(user);
        console.log(`Unbanned ${user}`);
        color = 16734464;
        title = `[${config.prefix}unban]`;
        text = `${user} разбанен на сервере!`;
        message.channel.send(infomessage(color, title, text));
    }
}
function infomessage(color, title, text) {
    const embed = new Discord.RichEmbed()
        .setColor(color)
        .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
        .addField(title, `${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
    return embed;
}