const cnf = require('../config.js');
const Discord = require('discord.js');
module.exports = {
    name:'ticket',
    async execute(message, client, args){
        let server = client.guilds.get(cnf.serverid);
        let channel = server.channels.find(val => val.name === `${message.author.username}-${message.author.discriminator}`);
            if(!channel){
                var everyone = message.guild.roles.find(rol => rol.name ===  "@everyone");
                var moder = message.guild.roles.find(rol => rol.name === `${cnf.modernamerole}`)
                await server.createChannel(`${message.author.username}-${message.author.discriminator}`, 'text').then(channel => {
                channel.setParent(cnf.tickenscategory)
                channel.overwritePermissions(everyone, {"READ_MESSAGE_HISTORY": false, "SEND_MESSAGES": false, "VIEW_CHANNEL": false})
                channel.overwritePermissions(moder, {"READ_MESSAGE_HISTORY": true, "SEND_MESSAGES": true, "VIEW_CHANNEL": true})
                channel.send(`${moder}, поступил запрос в поддержку от ${message.author}`)
                channel.send(`${message.author}, напишите сюда, пожалуйста, причину обращения в поддержку.`)
                });
                message.guild.channels.find(val => val.name === `${message.author.username}-${message.author.discriminator}`).overwritePermissions(message.author.id, {
                    VIEW_CHANNEL: true, //you set the perms that you want to overwrite
                    SEND_MESSAGES: true,
                    READ_MESSAGE_HISTORY: true,
                    ATTACH_FILES: true
                });
                return;
            }else{
                message.delete();
            }
        if(args[0] == 'close'){
            let channel = server.channels.find(val => val.name === `${message.author.username}-${message.author.discriminator}`);
            if(channel){
                channel.delete();
                message.reply('Ваш вопрос был закрыт!');
            }
            return;
        }
    }
}