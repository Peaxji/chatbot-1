const cnf = require('../config.js');
const Discord = require('discord.js');
module.exports = {
    name:'radio',
    execute(message, client, args){
        message.delete();
    	const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${cnf.prefix}radio]`;
          text = `Ты не в голосовом канале`;
          message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
          return;
        }
    	if(!args[0]){
    		const embed = new Discord.RichEmbed()
	            .setColor('#c7fcec')
	            .setAuthor('radio')
	            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
	            .setDescription(`Список радио:\n1. Rock\n2. Trap\n3. Pop\n4. EDM\n5. Drum'n'Bass\nПишите ${cnf.prefix}radio цифра\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        	message.channel.send(embed).then(msg => msg.delete(15000));
    		return;
    	}
    	if(args[0] == '1'){
    	
		message.member.voiceChannel.join()
    	connection = client.voiceConnections.get(message.guild.id);
    	connection.playArbitraryInput('http://galnet.ru:8000/hard', { seek: 0, volume: 0.3 });
    	const embed = new Discord.RichEmbed()
	            .setColor('#c7fcec')
	            .setAuthor('radio')
	            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
	            .setDescription(`Включена станция **Rock**!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        	message.channel.send(embed).then(msg => msg.delete(15000));
    	return;
    	}
    	if(args[0] == '2'){
    	const { voiceChannel } = message.member;
    	voiceChannel.join();
    	connection = client.voiceConnections.get(message.guild.id);
    	connection.playArbitraryInput('http://air.radiorecord.ru:8102/trap_320', { seek: 0, volume: 0.3 });
    	const embed = new Discord.RichEmbed()
	            .setColor('#c7fcec')
	            .setAuthor('radio')
	            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
	            .setDescription(`Включена станция **Trap**!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        	message.channel.send(embed).then(msg => msg.delete(15000));
    	return;
    	}
    	if(args[0] == '3'){
    	const { voiceChannel } = message.member;
    	voiceChannel.join();
    	connection = client.voiceConnections.get(message.guild.id);
    	connection.playArbitraryInput('http://ice-the.musicradio.com/CapitalXTRANationalMP3', { seek: 0, volume: 0.3 });
    	const embed = new Discord.RichEmbed()
	            .setColor('#c7fcec')
	            .setAuthor('radio')
	            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
	            .setDescription(`Включена станция **Pop**!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        	message.channel.send(embed).then(msg => msg.delete(15000));
    	return;
    	}//http://air.radiorecord.ru:805/club_320
    	if(args[0] == '4'){
    	const { voiceChannel } = message.member;
    	voiceChannel.join();
    	connection = client.voiceConnections.get(message.guild.id);
    	connection.playArbitraryInput('http://air.radiorecord.ru:805/club_320', { seek: 0, volume: 0.3 });
    	const embed = new Discord.RichEmbed()
	            .setColor('#c7fcec')
	            .setAuthor('radio')
	            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
	            .setDescription(`Включена станция **EDM**!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        	message.channel.send(embed).then(msg => msg.delete(15000));
    	return;
    	}
    	if(args[0] == '5'){
    	const { voiceChannel } = message.member;
    	voiceChannel.join();
    	connection = client.voiceConnections.get(message.guild.id);
    	connection.playArbitraryInput('http://air.radiorecord.ru:805/drumhits_320', { seek: 0, volume: 0.3 });
    	const embed = new Discord.RichEmbed()
	            .setColor('#c7fcec')
	            .setAuthor('radio')
	            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
	            .setDescription(`Включена станция **Drum'n'bass**!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        	message.channel.send(embed).then(msg => msg.delete(15000));
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