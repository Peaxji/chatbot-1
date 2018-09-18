const config = require('../config.js');
const language = require('../language.json');
const Discord = require('discord.js');
module.exports = {
    name:'stop',
    execute(message, client){
        message.delete();
    	const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${config.prefix}stop]`;
          text = `Ты не в голосовом канале`;
          message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
          return;
        }
    	let player = client.voiceConnections.get(message.guild.id);
    	player.dispatcher.end();
    	client.voiceConnections.get(message.guild.id).disconnect();
    	const embed = new Discord.RichEmbed()
	            .setColor('#c7fcec')
	            .setAuthor('radio')
	            .setFooter("Coder - cheesega. Version: 2.8", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
	            .setDescription(`Музыка выключена!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        	message.channel.send(embed).then(msg => msg.delete(15000));
    	return;
    }
}