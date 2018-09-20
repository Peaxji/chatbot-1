var perms = require('../permissions.js');
const config = require('../config.js');
const language = require('../language.json');
const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name:'addword',
    execute(message, args) {
        var badwordslist = JSON.parse(fs.readFileSync('words.json'));
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}addword]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        var replace = /\[(.*?)\]/ism;
        var matches = replace.exec(message.content); 
        if(!matches){
            color = 16734464;
            title = `[${config.prefix}addword]`;
            text = `Используйте ${config.prefix}addmat [слово]!`;
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(badwordslist.indexOf("^"+matches[1]+"$") == -1){
        	badwordslist.push("^"+matches[1]+"$");
        	color = 16711680;
            title = `[${config.prefix}addword]`;
            text = `Слово было добавлено в список запрещённых слов!`;
            message.channel.send(infomessage(color, title, text));
            fs.writeFile('words.json', JSON.stringify(badwordslist), function() {/*console.log(badwordslist);*/});
        	return;
        }else{
        	color = 16711680;
            title = `[${config.prefix}addword]`;
            text = `Это слово уже есть в списке запрещённых слов!`;
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