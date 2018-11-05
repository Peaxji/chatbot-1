var perms = require('../permissions.js');
const cnf = require('../config.js');
const language = require('../language.json');
module.exports = {
    name: 'sendlog',
    async execute(message, args) {
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${cnf.prefix}sendlog]`;
            text = language.error1.replace('{0}', cnf.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        if(!args[0]) return message.reply(`выберете дату. Она должна быть в формате день.месяц.год. Например ${Day}.${Month}.${Year}`);
        try {
            await message.author.send(`Лог чата выбранной вами даты:`, {
                files: [
                    `./log/${args[0]}.txt`
                ]
            })
        } catch (e) {
            message.reply("у вас закрыте сообщения!")
        }
    }
}
Data = new Date();
    Year = Data.getFullYear();
    Month = Data.getMonth()+1;
    Day = Data.getDate();
    Hour = Data.getHours();
    Minutes = Data.getMinutes();