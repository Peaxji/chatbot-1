const config = require('../config.js');
const Discord = require('discord.js');
module.exports = {
    name: 'github',
    execute(message, args) {
        color = 5504768;
        title = `[${config.prefix}github]`;
        text = `\nМой github - **[жми](https://github.com/cheesegaproj/chatbot)**`;
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