var perms = require('../permissions.js');
const cnf = require('../config.js');
const language = require('../language.json');
const Discord = require('discord.js');
module.exports = {
    name: 'clean',
    execute(message, args) {
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${cnf.prefix}clean]`;
            text = language.error1.replace('{0}', cnf.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }    
        async function clear() {
            if(!args[0]){
                color = 16711680;
                title = `[${cnf.prefix}clean]`;
                text = language.clean1.replace('{0}', cnf.prefix);
                message.channel.send(infomessage(color, title, text));
                return
            }
            const fetched = await message.channel.fetchMessages({limit: args[0]});
            console.log(fetched.size + ` ${language.clean2}`);
            message.channel.bulkDelete(fetched).then(() => {
                color = 16777215;
                title = `[${cnf.prefix}clean]`;
                text = language.clean3.replace('{0}', fetched.size);
                message.channel.send(infomessage(color, title, text)).then(msg => {msg.delete(5000)});
            }) 
        }clear();
    }
}
function infomessage(color, title, text) {
    const embed = new Discord.RichEmbed()
        .setColor(color)
        .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
        .addField(title, `${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
    return embed;

}