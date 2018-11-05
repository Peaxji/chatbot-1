var perms = require('../permissions.js');
const cnf = require('../config.js');
const language = require('../language.json');
const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
    name: 'clear',
    execute(message, args, client) {
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${cnf.prefix}clear]`;
            text = language.error1.replace('{0}', cnf.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        purge(message, args, client);
        return;
    }
}
function infomessage(color, title, text) {
    const embed = new Discord.RichEmbed()
        .setColor(color)
        .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
        .addField(title, `${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
    return embed;

}
async function purge(message, args, client) {
    if(!args[0]){
        color = 16711680;
        title = `[${cnf.prefix}clean]`;
        text = `Введи число сообщений, которое хочешь удалить (0-100) ${cnf.prefix}clear 100`;
        message.channel.send(infomessage(color, title, text));
        return
    }
    const fetched = await message.channel.fetchMessages({limit: args[0]});
    var messages = [];
    fetched.forEach(function(element, index, array) {
        if(element.author.id == client.user.id || element.content.startsWith(cnf.prefix)) messages.push(element);
    });
    messages.forEach(function(element, index, array) {
        message.channel.fetchMessage(element.id)
            .then(message => message.delete())
    });
}