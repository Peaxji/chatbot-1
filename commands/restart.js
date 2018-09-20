var perms = require('../permissions.js');
const config = require('../config.js');
const language = require('../language.json');
const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
    name: 'restart',
    execute(message) {
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}restart]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        color = 16711680;
    	title = `[${config.prefix}restart]`;
    	text = `**Внимание!** Перезагрузка бота!`;
    	message.channel.send(infomessage(color, title, text));
	    message.delete()
            .then(message => client.destroy())
            .then(() => client.login(config.token))
            .then(() => console.log("Restarting the bot..."));
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