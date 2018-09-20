const config = require('../config.js');
const language = require('../language.json');
const Discord = require('discord.js');
module.exports = {
    name:'radio',
    execute(message, client, args){
        message.delete();
    	const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${config.prefix}stop]`;
          text = `Ты не в голосовом канале`;
          message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
          return;
        }
    	if(!args[0]){
    		const embed = new Discord.RichEmbed()
	            .setColor('#c7fcec')
	            .setAuthor('radio')
	            .setFooter("Coder - cheesega. ", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
	            .setDescription(`Список радио:\n1. Rock\n2. Trap\n3. Pop\n4. EDM\n5. Drum'n'Bass\nПишите ${config.prefix}radio цифра\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        	message.channel.send(embed).then(msg => msg.delete(15000));
    		return;
    	}
    	if(args[0] == '1'){
    	const { voiceChannel } = message.member;
    	voiceChannel.join();
    	connection = client.voiceConnections.get(message.guild.id);
    	connection.playArbitraryInput('http://galnet.ru:8000/hard', { seek: 0, volume: 0.3 });
    	const embed = new Discord.RichEmbed()
	            .setColor('#c7fcec')
	            .setAuthor('radio')
	            .setFooter("Coder - cheesega. ", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
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
	            .setFooter("Coder - cheesega. ", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
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
	            .setFooter("Coder - cheesega. ", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
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
	            .setFooter("Coder - cheesega. ", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
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
	            .setFooter("Coder - cheesega. ", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
	            .setDescription(`Включена станция **Drum'n'bass**!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        	message.channel.send(embed).then(msg => msg.delete(15000));
    	return;
    	}
    }
}