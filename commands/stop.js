const cnf = require('../config.js');
const language = require('../language.json');
const Discord = require('discord.js');
module.exports = {
    name:'stop',
    execute(message, client){
        message.delete(5000);
    	const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${cnf.prefix}stop]`;
          text = `Ты не в голосовом канале`;
          message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
          return;
        }
        let player = client.voiceConnections.get(message.guild.id);
        if(!player) return message.reply('плеер не играет.');
    	player.disconnect()
    	const embed = new Discord.RichEmbed()
	            .setColor('#c7fcec')
	            .setAuthor('radio')
	            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
	            .setDescription(`Музыка выключена!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        	message.channel.send(embed).then(msg => msg.delete(5000));
    	return;
    }
}
function infomessage(color, title, text) {
    const embed = new Discord.RichEmbed()
        .setColor(color)
        .setFooter("Coder - cheesega. Version: 2.9", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
        .addField(title, `${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
    return embed;
}