var perms = require('../permissions.js');
const config = require('../config.js');
const language = require('../language.json');
const Discord = require('discord.js');
module.exports = {
    name: 'say',
    execute(message, args) {
        message.delete();
		if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}say]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        if(!args[0]) return message.reply('напишите название канала, в который хотите сделать объявление.')
        if(!args[1]) return message.reply('напишите текст объявления.');
        channel = message.guild.channels.find('name', args[0]);
        sayMessage = args.join(" ");
        sayMessage = sayMessage.replace(args[0], '');
        const embed = new Discord.RichEmbed()
		    .setAuthor(`▢Attention!▢`)
            .setColor(16711680)
            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .setDescription(`${sayMessage}\nАвтор объявления: ${message.author}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`);
		channel.send(embed);
    }
}