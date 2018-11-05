var cnf = require('./config.js');
const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const request = require('request');
const ytdl = require('ytdl-core');
const YTsearch = require('youtube-search');
const queues = {};
var count = 0;
var volume = 30/100;
const language = require('./language.json');
var Data = new Date();
var Year = Data.getFullYear();
var Month = Data.getMonth();
var Day = Data.getDate();
var timeoutmessage = {};
var Hour = Data.getHours();
var Minutes = Data.getMinutes();
const cooldown = new Set();
const opts = {
  maxResults: 4,
  key: cnf.yt_api_key
};
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
var mutedlist = JSON.parse(fs.readFileSync('muted.json'));
var perms = require('./permissions.js');
var IsAuth = false;
/* RAINBOW START */
var interval;
let place = 0;
const size = 40;
const rainbow = new Array(size);

for (var i=0; i<size; i++) {
  var red   = sin_to_hex(i, 0 * Math.PI * 2/3);
  var blue  = sin_to_hex(i, 1 * Math.PI * 2/3);
  var green = sin_to_hex(i, 2 * Math.PI * 2/3);

  rainbow[i] = '#'+ red + green + blue;
}

function sin_to_hex(i, phase) {
  var sin = Math.sin(Math.PI / size * 2 * i + phase);
  var int = Math.floor(sin * 127) + 128;
  var hex = int.toString(16);

  return hex.length === 1 ? '0'+hex : hex;
}
function discoRole() {
    if(cnf.rainbowrolesonoff == 'on'){
    if(!IsAuth) return;
        let server = client.guilds.get(cnf.serverid);
        let theRole = server.roles.find('name', cnf.rainbowroles);
        theRole.setColor(rainbow[place]).catch(console.error);
        if(place == (size - 1)) {
            place = 0;
        } else {
            place++;
        }
    }
}
setInterval(() => { discoRole(); }, 150);

client.login(cnf.token).catch(err => {
           // handle rejection here
        });


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!\nHello! I am moderation bot :) 
My creator — cheesega
Version: 3.0
github — https://github.com/cheesegaproj/chatbot
Discord — cheesega#9496
Hmm... You are ready? Go!`);
    IsAuth = true;
    setInterval(status, 5000);
});
ready=[`send me ${cnf.prefix}info`, 'coder - cheesega', 'musicbot', 'moderationbot', 'games', 'github.com/cheesegaproj'];
ready2=0;
function status(){
    client.user.setActivity(ready[ready2], { type: 'LISTENING' }).catch(console.error);
    ready2+=1;
    if(ready2==6){
        ready2=0;
    }
}

client.on('guildMemberAdd', member => {
    if(cnf.defaultroleonoff == "on"){
        let role = client.guilds.get(cnf.serverid).roles.find('name', cnf.defaultrole).id;
        member.addRole(role);
    }else if(cnf.defaultroleonoff == "off"){
        console.log("addrole new member: off");
    }
    if(mutedlist[member.id]) {
        let muterole = client.guilds.get(cnf.serverid).roles.find('name', cnf.muterol).id;
        member.addRole(muterole);
    }
    var newUsers = '';
    const guild = member.guild;
    if(cnf.welcomeonoff == 'on'){
        const defaultChannel = guild.channels.find(c=> c.permissionsFor(guild.me).has("SEND_MESSAGES"));
        color = 16777215;
        title = '[welcome!]';
        text = `${member}, ${cnf.welcome}`;
        defaultChannel.send(infomessage(color, title, text));
    }
    if(cnf.channellogonoff == 'on'){
        var channel = client.guilds.get(cnf.serverid).channels.find('name', channellog);
        const embed = new Discord.RichEmbed()
        .setAuthor(`${member.user.username}#${member.user.discriminator}`, member.user.avatarURL)
        .setColor(16777215)
        .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
        .setDescription(`Пользователь зашел на сервер.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        channel.send(embed);
    }
})


client.on('message', async message => {
    if(message.author === client.user) return;
    if (!message.content.startsWith(cnf.prefix)){
        time = 2;
        var data = Date.now()
    	if(cooldown.has(message.author.id)) {
    		if(!timeoutmessage[message.author.id]) timeoutmessage[message.author.id] = 0;
    		timeoutmessage[message.author.id] += 1;
    		message.reply(`Ты слишком быстро пишешь! Подожди немного. Продолжишь - получишь мут`).then(msg => msg.delete(3000));
    		if(timeoutmessage[message.author.id] == 4){
    			data = [message.author.id, cnf.automutetime, 'Спам/флуд'];
                Mute(message, data, true);
    		}
    		return;
    	}
    	cooldown.add(message.author.id);
    	setTimeout(() => {
        	cooldown.delete(message.author.id)
        	timeoutmessage[message.author.id] = 0
    	}, time * 1000)
        if(cnf.checkwordsonoff == 'on') checkForMatWords(message);
        if(cnf.chatlog == 'on'){
        	fs.stat(`log/${Day}.${Month}.${Year}.txt`, function(err, stat) {
    		if(err == null) {
        		fs.appendFileSync(`log/${Day}.${Month}.${Year}.txt`, `[${Year}-${Month}-${Day}|${Hour}:${Minutes}|${message.author.tag}|${message.channel.name}] --> ${message.content}`+'\n',  "utf-8");
   			} else if(err.code == 'ENOENT') {
        		fs.writeFile(`log/${Day}.${Month}.${Year}.txt`, `LOG FOR DATE ${Day}.${Month}.${Year}\n`);
    		} else {
        		console.log('Some other error: ', err.code);
    		}
			});
        }
        return;
    };
    const args = message.content.slice(cnf.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if(commandName == "info") {
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('info').execute(message, args);
        return;
    }

    if(commandName == "exit") {
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('exit').execute(message, args);
        return;
    }

    if(commandName == "clean"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('clean').execute(message, args);
        return;
    };
    if(commandName == "clear") {
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('clear').execute(message, args, client);
        return;
    }
    if(commandName == "mute"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${cnf.prefix}mute]`;
            text = language.error1.replace('{0}', cnf.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        Mute(message, args);
        return;
    }

    if(commandName == "rwarnings"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('rwarnings').execute(message, args);
        return;
    }

    if(commandName == "warnings"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('warnings').execute(message, args);
        return;
    }

    if(commandName == "addword") {
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('addword').execute(message, args);
        return;
    }
    if(commandName == "unmute"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        var infobanlist = JSON.parse(fs.readFileSync('infoban.json'));
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${cnf.prefix}unmute]`;
            text = language.error1.replace('{0}', cnf.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute){
            color = 16734464;
            title = `[${cnf.prefix}unmute]`;
            text = `Используйте ${cnf.prefix}unmute @user!`;
            message.channel.send(infomessage(color, title, text));
            return
        }else{
            color = 16734464;
            title = `[${cnf.prefix}unmute]`;
            text = `Пользователь убран из мута (${member})!\nУ него ${infobanlist[member.id]} предупреждений(я)! Бан даётся при ${cnf.warningcount} предупреждениях!`;
            message.channel.send(infomessage(color, title, text));
            let role = client.guilds.get(cnf.serverid).roles.find('name', cnf.muterol).id;
            member.removeRole(role);
            delete mutedlist[member.id];
            if(infobanlist[member.id] >= cnf.warningcount){
		        member.ban();
		        color = 16734464;
		        title = `[${cnf.prefix}unmute]`;
		        text = `${member} забанен на сервере!\nЕго ID: ${member.id}`;
		        message.channel.send(infomessage(color, title, text));
		        delete infobanlist[member.id];
		        return true;
		    }
            fs.writeFile('infoban.json', JSON.stringify(infobanlist), function() {/*console.log(whitelist);*/});
        }
        return;
    }
    if(commandName == "muted") {
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('muted').execute(message, args);
        return;
    }
    if(commandName == "github"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('github').execute(message, args);
        return;
    }

    if(commandName == "kick"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('kick').execute(message, args);
        return;
    }

    if(commandName == "ban"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('ban').execute(message, args);
        return;
    }

    if (commandName == "unban") {
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('unban').execute(message, args);
        return;  
    }
    if(commandName == "rainbow"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('rainbow').execute(message, args, client);
        return;
        }
    
    if(commandName == "coin"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('coin').execute(message, args);
        return;
    }

    if(commandName == "report"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('report').execute(message, args);
        return;
    }

    if(commandName == "admins"){    
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('admins').execute(message);
    	return;
	}
	if(commandName == "restart"){
		console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('restart').execute(message);
        return;
    }

    if(commandName == 'say'){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('say').execute(message, args);
        return;
    }

    if(commandName == 'sendlog'){
    	console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('sendlog').execute(message, args);
        return
    }

    if(commandName == 'stop'){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('stop').execute(message, client);
        return
    }

    if(commandName == 'radio'){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('radio').execute(message, client, args);
    }

    if(commandName == 'ticket'){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        client.commands.get('ticket').execute(message, client, args);
    }

	if(commandName == 'play'){
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        message.delete(5000);
        let suffix = message.content.split(" ").slice(1).join(" ");
        if (!suffix) return message.channel.send(`Пожалуйста используйте ${cnf.prefix}play название трека/ссылка`).then(msg => msg.delete(5000));
        if (!client.voiceConnections.get(message.author.id)) {
          if (message.channel.type !== 'text'){
          	color = 16711680;
            title = `[${cnf.prefix}rainbow]`;
            text = `Ты не в голосовом канале`;
            message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
            return;
          }
          const { voiceChannel } = message.member;
          if (!voiceChannel){
          	color = 16711680;
            title = `[${cnf.prefix}rainbow]`;
            text = `Ты не в голосовом канале`;
            message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
            return;
          }
          voiceChannel.join();
        }
        playSong(message, getQueue(message.guild.id), suffix);
        return;
    }
    if(commandName == "skip"){       
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        message.delete(5000);
        const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${cnf.prefix}rainbow]`;
          text = `Ты не в голосовом канале`;
          message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
          return;
        }
        let player = client.voiceConnections.get(message.guild.id);
        if(!player || !player.speaking){
            color = 6143311;
            title = "MusicSound";
            text = "Плеер не играет!";
            message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
            return;
        }
        player.dispatcher.end();
        return;
    }
    if(commandName == "pause"){       
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        message.delete(5000);
        const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${cnf.prefix}rainbow]`;
          text = `Ты не в голосовом канале`;
          message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
          return;
        }
        let player = client.voiceConnections.get(message.guild.id);
        if(!player || !player.speaking){
            color = 6143311;
            title = "MusicSound";
            text = "Плеер не играет!";
            message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
        }
            color = 6143311;
            title = "MusicSound";
            text = "Пауза включена!";
            message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
        player.dispatcher.pause();
        return;
    }
    if(commandName == "resume"){    
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        message.delete(5000);
        const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${cnf.prefix}resume]`;
          text = `Ты не в голосовом канале`;
          message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
          return;
        }
        let player = client.voiceConnections.get(message.guild.id);
        color = 6143311;
        title = "MusicSound";
        text = "Продолжаем!";
        message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
        player.dispatcher.resume();
        return;
    }
    if(commandName == "volume"){   
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        message.delete(5000);
        const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
            title = `[${cnf.prefix}volume]`;
            text = `Ты не в голосовом канале`;
            message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
            return;
        }
        let player = client.voiceConnections.get(message.guild.id);
        if(!args[0]){
            color = 6143311;
            title = "MusicSound";
            text = "Укажите громкость!";
            message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
            return;
        }
        if(args[0]>100){
            color = 6143311;
            title = "MusicSound";
            text = "Значение громкости указывается от 0 до 100!";
            message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
            return;
        }
        color = 6143311;
        title = "MusicSound";
        text = `Установлена новая громкость ${args[0]}!`;
        message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
        volume = args[0]/100;
        player.dispatcher.setVolume(volume);
        return
    }
    if(commandName == "queue"){     
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        message.delete(5000);
    	color = 6143311;
        title = "MusicSound";
        text = "";
        var queue = getQueue(cnf.serverid);
        queue.forEach(function(element, index, array){
            text += '\n'+"`"+(index+1)+'.` `'+Math.floor(element.seconds/60)+':'+element.seconds%60+'`'+' '+`${element.title}`;
        })
        const embed = new Discord.RichEmbed()
            .setColor(16734464)
            .setAuthor(title)
            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .setDescription(`${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        message.channel.send(embed).then(msg => msg.delete(5000));
        return
    }
    if(commandName == "remove") {
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        message.delete(5000);
        const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${cnf.prefix}remove]`;
          text = `Ты не в голосовом канале`;
          message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
          return;
        }
        if(removeMusic(message, args)){
        	color = 6143311;
            title = "MusicSound";
            text = "Трек удалён из очереди!";
            message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
            return;
        }
        if(!removeMusic(message, args)){
        	color = 6143311;
            title = "MusicSound";
            text = "Трек не удалён из очереди!";
            message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
            return;
        }
    }
});

function removeMusic(msg, args) {
    g = parseInt(args[0] - 1);
    queue = getQueue(cnf.serverid);
    if(queue[g] == undefined) return false;
    fs.unlinkSync('./music/'+queue[g].toplay)
    queue.splice(g, 1);
    return true;
}

function infomessage(color, title, text) {
        const embed = new Discord.RichEmbed()
            .setColor(color)
            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .addField(title, `${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        return embed;

    }    

function Mute(message, args, auto) {
    console.log(`detected badwordslist for bot and give mute!`);
    let tomute;
    if(!auto) tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(auto) tomute = message.guild.members.get(args[0]);
    if(!tomute){
        const embed = new Discord.RichEmbed()
            .setColor(16734464)
            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .addField(`[${cnf.prefix}mute]`, `Используйте ${cnf.prefix}mute @user 1s/m/h/d!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        message.channel.send(embed);
        return
    }
    let mutetime = args[1];
    if(!mutetime){
        const embed = new Discord.RichEmbed()
            .setColor(16734464)
            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")        
            .addField("[!mute]", `Вы не указали время!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            message.channel.send(embed);
        return
    }
    let reason = args[2];
    if(ms(mutetime) == 0) mutetime = "∞"; 
    if(!reason) {
        reason = "Unspecified.";
    } else {
        if(!auto) {
            var replace = /\[(.*?)\]/ism;
            var matches = replace.exec(message.content); 
            if(matches[1] != undefined) { reason = matches[1]; } else { reason = "Unspecified."; }
        } else {reason = args[2]}
    }
    let role = client.guilds.get(cnf.serverid).roles.find('name', cnf.muterol).id;
    if(!auto) { mod = message.author; } else { mod = client.user; }
    tomute.addRole(role).then(function() {
        let user = client.guilds.get(cnf.serverid).members.get(tomute.id).user;
        const embed = new Discord.RichEmbed()
            .setColor(13632027)
            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .addField("User", `<@${tomute.id}>`, true)
            .addField("Moderator", `<@${mod.id}>`, true)
            .addField("Reason", `${reason}`, true)
            .addField("Duration", `${mutetime}`, true)
            if(cnf.chatlog == 'on'){
        		fs.appendFileSync(`log/${Day}.${Month}.${Year}.txt`, `[${Year}-${Month}-${Day}|${Hour}:${Minutes}|${message.channel.name}] MUTED USER ${tomute.user.username}#${tomute.user.discriminator}! REASON: ${reason}. TIME: ${mutetime}. MODERATOR: ${mod.tag}`+'\n',  "utf-8");
    		}
            message.channel.send(embed);
        if(ms(mutetime) != 0) mutedlist[tomute.id] = ms(mutetime);
        mutedlist[tomute.id] = ms(mutetime);
        var infobanlist = JSON.parse(fs.readFileSync('infoban.json'));
        if(cnf.warningcountonoff == 'on'){
            if(!infobanlist[tomute.id]) infobanlist[tomute.id] = 0;
            infobanlist[tomute.id] += 1;
        }else{
            if(!infobanlist[tomute.id]) infobanlist[tomute.id] = 0;
        }
        if(cnf.channellogonoff == 'on'){
        	client.commands.get('logmute').execute(client, tomute, mutetime, reason, mod);
        }
    	fs.writeFile('infoban.json', JSON.stringify(infobanlist), function() {/*console.log(whitelist);*/});
        return;
    });
}

function checkForMatWords(message) {
    var badwordslist = JSON.parse(fs.readFileSync('words.json'));
    content = message.content.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    arr = content.split(" ");
    for (var key in badwordslist) {
        pattern = new RegExp(badwordslist[key], "gi");
        for (var key in arr) {
            if(arr[key].search(pattern) != -1) {
                data = [message.author.id, cnf.automutetime, 'Нецензурные выражения'];
                Mute(message, data, true);
                message.delete(5000);
                return;
            }
        }
    }
}
//Переносить в js с передачей client.
function minusMutedList() {
    for (var key in mutedlist) {
        if(mutedlist[key] <= 1) { 
            mutedlist[key] = mutedlist[key] - 1;
            if(UnMute(cnf.serverid, key)) delete mutedlist[key];
        } else {
            mutedlist[key] = mutedlist[key] - 1;
        }
    }
}

setInterval(minusMutedList, 1);

function UnMute(channel, id) {
    var infobanlist = JSON.parse(fs.readFileSync('infoban.json'));
    if(!IsAuth) return false;
    let role = client.guilds.get(channel).roles.find('name', cnf.muterol).id;
    member = client.guilds.get(channel).members.get(id);
    try {
        client.guilds.get(channel).members.get(id).removeRole(role);
    } catch(err) {
        return false;
    }
    if(!infobanlist[member.id]) !infobanlist[member.id] 
    if(infobanlist[member.id] >= cnf.warningcount){
        member.ban();
        color = 16734464;
        title = `[${cnf.prefix}unmute]`;
        text = `${member} забанен на сервере!\nЕго ID: ${member.id}`;
        var channel = client.guilds.get(channel).channels.find('id', cnf.generalchatid);
        channel.send(infomessage(color, title, text));
        delete infobanlist[member.id];
        return true;
    }
    color = 16734464;
    title = `[${cnf.prefix}unmute]`;
    text = `Пользователь убран из мута(<@${id}>)!\nУ него ${infobanlist[id]} предупреждений(я)! Бан даётся при ${cnf.warningcount} предупреждениях!`;
    var channel = client.guilds.get(channel).channels.find('id', cnf.generalchatid);
    channel.send(infomessage(color, title, text));
    fs.writeFile('infoban.json', JSON.stringify(infobanlist), function() {/*console.log(whitelist);*/});
    return true;
}

function saveMutedList() {
    fs.writeFile('muted.json', JSON.stringify(mutedlist), function() {/*console.log(whitelist);*/});
}
setInterval(saveMutedList, 2000);

function onedate() {
    Data = new Date();
    Year = Data.getFullYear();
    Month = Data.getMonth()+1;
    Day = Data.getDate();
    Hour = Data.getHours();
    Minutes = Data.getMinutes();
}
setInterval(onedate, 1000);

function getQueue(guild) {
  if (!guild) return
  if (typeof guild == 'object') guild = guild.id
  if (queues[guild]) return queues[guild]
  else queues[guild] = []
  return queues[guild]
}

function playSong(msg, queue, song) {
  if (!msg || !queue) return
  if (song) {
    YTsearch(song, opts, function(err, results) {
      if (err){
      	color = 6143311;
      	title = 'MusicSound';
      	text = 'Видео не найдено!';
      	msg.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
      	return;
      }
      song = (song.includes("https://" || "http://")) ? song : results[0].link
      let stream = ytdl(song, {
        quality: 'highestaudio',
        audioonly: true
      })
      stream.on('info', async function(info) {
      	color = 6143311;
      	title = 'MusicSound';
      	text = `Добавлено в очередь **[${info.title}](https://www.youtube.com/watch?v=${info.id})**`;
      	msg.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
        let test;
        if (queue.length === 0) test = true;
        var file = fs.createWriteStream('./music/'+info.video_id+'.mp3');
        var download = await stream.pipe(file);
        queue.push({
            "title": info.title,
            "id": info.video_id,
            "requested": msg.author.id,
            "toplay": info.video_id+'.mp3',
            "seconds": info.length_seconds,
        })
        await download.on('finish', function() {
           console.log(`Трек ${info.title} скачан! File Name: `+info.video_id+'.mp3');
        });
        if (test) {
            setTimeout(function() {
              playSong(msg, queue)
            }, 3000)
        }
      });
    })
  } else if (queue.length != 0) {
  	color = 6143311;
    title = 'MusicSound';
    text = `Сейчас играет **[${queue[0].title}](https://www.youtube.com/watch?v=${queue[0].id})** | добавил <@${queue[0].requested}>`;
    msg.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
    let connection = client.voiceConnections.get(msg.guild.id);
    if (!connection) return;
    var intent = connection.playFile('./music/'+queue[0].toplay, { seek: 0, volume: volume });
    intent.on('error', () => {
        queue.shift()
        playSong(msg, queue)
    })

    intent.on('end', () => {
    	fs.unlinkSync('./music/'+queue[0].toplay)
        queue.shift()
        playSong(msg, queue)
    })
  } else {
    color = 6143311;
    title = 'MusicSound';
    text = `Очередь пуста!`;
    msg.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
    client.voiceConnections.get(msg.guild.id).disconnect();
  }
}


//logs
client.on('guildMemberRemove', member => {
    client.commands.get('leavemessage').execute(client, member);
})
client.on('channelCreate', channel => {
    // if(cnf.channellogonoff == 'on'){
    //     var channel = client.guilds.get(cnf.serverid).channels.find('name', cnf.serverid);
    //     const embed = new Discord.RichEmbed()
    //         .setAuthor(`Создание канала ${channel.name}`)
    //         .setColor(16777215)
    //         .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
    //         .setDescription(`Был создан канал **${channel.name}**. Его тип: ${channel.type}.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
    //     channel.send(embed);
    // }
    client.commands.get('createchannel').execute(client, channel);
})
client.on('channelDelete', channel =>{
    if(cnf.channellogonoff == 'on'){
        var channel1 = client.guilds.get(cnf.serverid).channels.find('name', cnf.channellog);
        const embed = new Discord.RichEmbed()
            .setAuthor(`Удаление канала ${channel.name}`)
            .setColor(16777215)
            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .setDescription(`Был удален канал **${channel.name}**. Его тип: ${channel.type}.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        channel1.send(embed);
    }
})
client.on('roleUpdate', role => {
    if(cnf.channellogonoff == 'on'){
        var channel1 = client.guilds.get(cnf.serverid).channels.find('name', cnf.channellog);
        if(role.name != cnf.rainbowroles){
            const embed = new Discord.RichEmbed()
                .setAuthor(`Обновление роли ${role.name}`)
                .setColor(16777215)
                .setFooter("Coder - cheesega. ", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
                .setDescription(`Была обновлена роль **${role.name}**.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            channel1.send(embed);
        }
    }
})
client.on('roleDelete', role => {
    if(cnf.channellogonoff == 'on'){
        var channel1 = client.guilds.get(cnf.serverid).channels.find('name', cnf.channellog);
        const embed = new Discord.RichEmbed()
            .setAuthor(`Удаление роли ${role.name}`)
            .setColor(16777215)
            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .setDescription(`Была удалена роль **${role.name}**.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        channel1.send(embed);
    }
})
client.on('guildBanAdd', (guild,user) => {
    if(cnf.channellogonoff == 'on'){
        var channel1 = client.guilds.get(cnf.serverid).channels.find('name', cnf.channellog);
        const embed = new Discord.RichEmbed()
            .setAuthor(`Новый бан`)
            .setColor(16777215)
            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .setDescription(`**${user.username}#${user.discriminator}** был забанен на сервере.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        channel1.send(embed);
    }
})
client.on('guildBanRemove', (guild,user) => {
    if(cnf.channellogonoff == 'on'){
        var channel1 = client.guilds.get(cnf.serverid).channels.find('name', cnf.channellog);
        const embed = new Discord.RichEmbed()
            .setAuthor(`Разбан`)
            .setColor(16777215)
            .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .setDescription(`**${user.username}#${user.discriminator}** был разбанен на сервере.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        channel1.send(embed);
    }
})
//logs end