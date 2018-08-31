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
var Hour = Data.getHours();
var Minutes = Data.getMinutes();
const cooldown = new Set();
const config = require('./config.js');
const opts = {
  maxResults: 4,
  key: config.yt_api_key
};
const client = new Discord.Client();
var lvls = JSON.parse(fs.readFileSync('lvls.json'));
var mutedlist = JSON.parse(fs.readFileSync('muted.json'));
var infobanlist = JSON.parse(fs.readFileSync('infoban.json'));
var badwordslist = JSON.parse(fs.readFileSync('words.json'));
var perms = require('./permissions.js');
var weather = require('weather-js');
var IsAuth = false;
/* RAINBOW START */
var interval;
let place = 0;
const size = 40;
const rainbow = new Array(size);

for (var i=0; i<size; i++) {
  var red   = sin_to_hex(i, 0 * Math.PI * 2/3); // 0   deg
  var blue  = sin_to_hex(i, 1 * Math.PI * 2/3); // 120 deg
  var green = sin_to_hex(i, 2 * Math.PI * 2/3); // 240 deg

  rainbow[i] = '#'+ red + green + blue;
}

function sin_to_hex(i, phase) {
  var sin = Math.sin(Math.PI / size * 2 * i + phase);
  var int = Math.floor(sin * 127) + 128;
  var hex = int.toString(16);

  return hex.length === 1 ? '0'+hex : hex;
}
function discoRole() {
    if(config.rainbowrolesonoff == 'on'){
    if(!IsAuth) return;
        let server = client.guilds.get(config.serverid);
        let theRole = server.roles.find('name', config.rainbowroles);
        theRole.setColor(rainbow[place]).catch(console.error);
        if(place == (size - 1)) {
            place = 0;
        } else {
            place++;
        }
    }
}
setInterval(() => { discoRole(); }, 150);

client.login(config.token).catch(err => {
           // handle rejection here
        });


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!\nHello! I am moderation bot :) 
My creator — cheesega
Version: 2.8
github — https://github.com/cheesegaproj
Discord — cheesega#9496
Hmm... You are ready? Go!`);
    IsAuth = true;
});
ready=[`send me ${config.prefix}info`, 'coder - cheesega', 'musicbot', 'moderationbot', 'games', 'github.com/cheesegaproj'];
ready2=0;
function status(){
    client.user.setActivity(ready[ready2], { type: 'LISTENING' }).catch(console.error);
    ready2+=1;
    if(ready2==6){
        ready2=0;
    }
}
setInterval(status, 5000);

client.on('guildMemberAdd', member => {
    if(config.defaultroleonoff == "on"){
        let role = client.guilds.get(config.serverid).roles.find('name', config.defaultrole).id;
        member.addRole(role);
    }else if(config.defaultroleonoff == "off"){
        console.log("addrole new member: off");
    }
    if(mutedlist[member.id]) {
        let muterole = client.guilds.get(config.serverid).roles.find('name', config.muterol).id;
        member.addRole(muterole);
    }
    var newUsers = '';
    const guild = member.guild;
    if(config.welcomeonoff == 'on'){
        const defaultChannel = guild.channels.find(c=> c.permissionsFor(guild.me).has("SEND_MESSAGES"));
        color = 16777215;
        title = '[welcome!]';
        text = `${member}, ${config.welcome}`;
        defaultChannel.send(infomessage(color, title, text));
    }
    if(config.channellogonoff == 'on'){
        var channel = client.guilds.get(config.serverid).channels.find('name', config.channellog);
        const embed = new Discord.RichEmbed()
        .setAuthor(`${member.user.username}#${member.user.discriminator}`, member.user.avatarURL)
        .setColor(16777215)
        .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
        .setDescription(`Пользователь зашел на сервер.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
       channel.send(embed);
        }
})

mess = 0;
function spam(){
    if(config.messagesonoff=='on'){
        var channel = client.guilds.get(config.serverid).channels.find('id', config.generalchatid);
        channel.send(config.messages[mess]);
        mess+=1;
        if(mess==config.messages.length){mess=0;}
    }
}
setInterval(spam, ms(config.messagesinterval));

client.on('message', message => {
    if(message.author === client.user) return;
    if (!message.content.startsWith(config.prefix)){
        if(config.checkwordsonoff == 'on') checkForMatWords(message);
        if(config.chatlog == 'on'){
        	fs.stat(`log/${Day}.${Month}.${Year}.txt`, function(err, stat) {
    		if(err == null) {
        		fs.appendFileSync(`log/${Day}.${Month}.${Year}.txt`, `[${Year}-${Month}-${Day}|${Hour}:${Minutes}|${message.author.tag}|${message.channel.name}] --> ${message.content}`+'\n',  "utf-8");
   			} else if(err.code == 'ENOENT') {
        		fs.writeFile(`log/${Day}.${Month}.${Year}.txt`, `LOG FOR DATE ${Day}.${Month}.${Year}\n`);
        		fs.appendFileSync(`log/${Day}.${Month}.${Year}.txt`, `[${Year}-${Month}-${Day}|${Hour}:${Minutes}|${message.author.tag}|${message.channel.name}] --> ${message.content}`+'\n',  "utf-8");
    		} else {
        		console.log('Some other error: ', err.code);
    		}
			});
        }
        if(config.lvlsonoff == 'on'){
            if(!lvls[message.author.id]) lvls[message.author.id] = 0;
            lvls[message.author.id]+=config.lvlplus;
            if(config.giverainbowlvlten == 'on'){
                if(lvls[message.author.id]>=config.tenlvl){
                    member = message.guild.member(message.author);
                    let role = client.guilds.get(config.serverid).roles.find('name', config.rainbowroles).id;
                    member.addRole(role);
                }
            }
        }
        return;
    };
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    if(commandName == "info") {
        if(!args.length) {
           text = `${language.oneinfo} **${config.prefix}info 1**):\n**1. ${config.prefix}mute\n2. ${config.prefix}addmat\n3. ${config.prefix}unmute\n4. ${config.prefix}muted\n5. ${config.prefix}github\n6. ${config.prefix}kick\n7. ${config.prefix}ban\n8. ${config.prefix}unban\n9. ${config.prefix}rainbow\n10. ${config.prefix}coin\n11. ${config.prefix}exit\n12. ${config.prefix}report\n13.${config.prefix}warnings\n14. ${config.prefix}rwarnings\n15. ${config.prefix}weather**`;
           console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
		   const embed = new Discord.RichEmbed()
		    .setAuthor(`[${config.prefix}info]`)
            .setColor(16777215)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .setDescription(`${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
		   message.channel.send(embed)
			.then(function (msg) {
                msg.react("◀").then(r => {
                    msg.react("▶");
                    
                    const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
                    const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;
                    
                    const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 });
                    const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000 });
                    
                    backwards.on('collect', r => {
                        embed.setDescription(`${language.oneinfo} **${config.prefix}info 1**):\n**1. ${config.prefix}mute\n2. ${config.prefix}addmat\n3. ${config.prefix}unmute\n4. ${config.prefix}muted\n5. ${config.prefix}github\n6. ${config.prefix}kick\n7. ${config.prefix}ban\n8. ${config.prefix}unban\n9. ${config.prefix}rainbow\n10. ${config.prefix}coin\n11. ${config.prefix}exit\n12. ${config.prefix}report\n13.${config.prefix}warnings\n14. ${config.prefix}rwarnings\n15. ${config.prefix}weather**\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`);
                        msg.edit(embed)
                    })
                    
                    forwards.on('collect', r => {
                        embed.setDescription(`${language.oneinfo} **${config.prefix}info 1**):\n**16. ${config.prefix}clear\n17. ${config.prefix}clean\n18. ${config.prefix}admins\n19. ${config.prefix}restart\n20. ${config.prefix}play\n21. ${config.prefix}pause\n22. ${config.prefix}resume\n23. ${config.prefix}skip\n24 ${config.prefix}volume\n25. ${config.prefix}remove\n26. ${config.prefix}queue\n27. ${config.prefix}lvl\n28. ${config.prefix}setlvl\n29. ${config.prefix}roulette\n30. ${config.prefix}sendlog\n31. ${config.prefix}say**\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`);
                        msg.edit(embed)
                    })
                })
            }).catch(err => {
           // handle rejection here
        })
            return;
        };
        if(args[0] == "1"){
            color = 16777215;
            title = `[${config.prefix}info 1]`;
            text = language.info1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));         
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            return;
        }
        if(args[0] == "2"){
            color = 16777215;
            title = `[${config.prefix}info 2]`;
            text = language.info2.replace('{0}', config.prefix);     
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "3"){
            color = 16777215;
            title = `[${config.prefix}info 3]`;
            text = language.info3.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "4"){
            color = 16777215;
            title = `[${config.prefix}info 4]`;
            text = language.info4.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "5"){
            color = 16777215;
            title = `[${config.prefix}info 5]`;
            text = language.info5.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            return;
        }
        if(args[0] == "6"){
            color = 16777215;
            title = `[${config.prefix}info 6]`;
            text = language.info6.replace('{0}', config.prefix);      
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "7"){
            color = 16777215;
            title = `[${config.prefix}info 7]`;
            text = language.info7.replace('{0}', config.prefix);       
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "8"){
            color = 16777215;
            title = `[${config.prefix}info 8]`;
            text = language.info8.replace('{0}', config.prefix);      
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "9"){
            color = 16777215;
            title = `[${config.prefix}info 9]`;
            text = language.info9.replace('{0}', config.prefix);
            text = text.replace('{0}', config.prefix);  
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "10"){
            color = 16777215;
            title = `[${config.prefix}info 10]`;
            text = language.info10.replace('{0}', config.prefix);     
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "11"){
            color = 16777215;
            title = `[${config.prefix}info 11]`;
            text = language.info11.replace('{0}', config.prefix);     
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "12"){
            color = 16777215;
            title = `[${config.prefix}info 12]`;
            text = language.info12.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "13"){
            color = 16777215;
            title = `[${config.prefix}info 13]`;
            text = language.info13.replace(/%/g, config.prefix);       
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "14"){
            color = 16777215;
            title = `[${config.prefix}info 14]`;
            text = language.info14.replace(/%/g, config.prefix);      
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "15"){
            color = 16777215;
            title = `[${config.prefix}info 15]`;
            text = language.info15.replace('{0}', config.prefix);       
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "16"){
            color = 16777215;
            title = `[${config.prefix}info 16]`;
            text = language.info16.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "17"){
            color = 16777215;
            title = `[${config.prefix}info 17]`;
            text = language.info17.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "18"){
            color = 16777215;
            title = `[${config.prefix}info 18]`;
            text = language.info18.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "19"){
            color = 16777215;
            title = `[${config.prefix}info 19]`;
            text = language.info19.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "20"){
            color = 16777215;
            title = `[${config.prefix}info 20]`;
            text = language.info20.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "21"){
            color = 16777215;
            title = `[${config.prefix}info 21]`;
            text = language.info21.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "22"){
            color = 16777215;
            title = `[${config.prefix}info 22]`;
            text = language.info22.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "23"){
            color = 16777215;
            title = `[${config.prefix}info 23]`;
            text = language.info23.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "24"){
            color = 16777215;
            title = `[${config.prefix}info 24]`;
            text = language.info24.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "25"){
            color = 16777215;
            title = `[${config.prefix}info 25]`;
            text = language.info25.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "26"){
            color = 16777215;
            title = `[${config.prefix}info 26]`;
            text = language.info26.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "27"){
            color = 16777215;
            title = `[${config.prefix}info 27]`;
            text = language.info27.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "28"){
            color = 16777215;
            title = `[${config.prefix}info 28]`;
            text = language.info28.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "29"){
            color = 16777215;
            title = `[${config.prefix}info 29]`;
            text = language.info29.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "30"){
            color = 16777215;
            title = `[${config.prefix}info 30]`;
            text = language.info30.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "31"){
            color = 16777215;
            title = `[${config.prefix}info 31]`;
            text = language.info31.replace('{0}', config.prefix);
            console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
    }
    if(commandName == "exit") {
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}exit]`;
            text = language.error1.replace('{0}', prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
            client.destroy().then(process.exit);
            return;
        }
    if(commandName == "clean"){
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}clean]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }    
        async function clear() {
            if(!args[0]){
                color = 16711680;
                title = `[${config.prefix}clean]`;
                text = language.clean1.replace('{0}', config.prefix);;
                message.channel.send(infomessage(color, title, text));
                return
            }
            const fetched = await message.channel.fetchMessages({limit: args[0]});
            console.log(fetched.size + ` ${language.clean2}`);
            message.channel.bulkDelete(fetched).then(() => {
                color = 16777215;
                title = `[${config.prefix}clean]`;
                text = language.clean3.replace('{0}', fetched.size);
                message.channel.send(infomessage(color, title, text)).then(msg => {msg.delete(5000)});
            }) 
        }clear();
    return;
};
    if(commandName == "clear") {
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}clear]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        purge(message, args);
        return;
    }
    if(commandName == "mute"){
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}mute]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        Mute(message, args);
        return;
    }

    if(commandName == "lvl"){
        var text = "";
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        message.delete(5000);
        if(!member){
            if(!lvls[message.author.id]){text=config.zerolvlname; lvls[message.author.id] = 0;}
            if(lvls[message.author.id]<config.onelvl) text=config.zerolvlname;
            if(lvls[message.author.id]>config.onelvl) text=config.onelvlname;
            if(lvls[message.author.id]>config.twolvl) text=config.twolvlname;
            if(lvls[message.author.id]>config.triolvl) text=config.triolvlname;
            if(lvls[message.author.id]>config.fourlvl) text=config.fourlvlname;
            if(lvls[message.author.id]>config.fivelvl) text=config.fivelvlname;
            if(lvls[message.author.id]>config.sixlvl) text=config.sixlvlname;
            if(lvls[message.author.id]>config.sevenlvl) text=config.sevenlvlname;
            if(lvls[message.author.id]>config.eightlvl) text=config.eightlvlname;
            if(lvls[message.author.id]>config.ninelvl) text=config.ninelvlname;
            if(lvls[message.author.id]>config.tenlvl) text=config.tenlvlname;
            const embed = new Discord.RichEmbed()
            .setColor('0080FF')
            .setAuthor(`[${config.prefix}lvl]`)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .addField("Очки", lvls[message.author.id], true)
            .addField("Звание", text, true)
            message.channel.send(embed).then(msg => msg.delete(5000));
            return;
        }else{
            if(!lvls[member.id]){text=zerolvlname; lvls[message.author.id] = 0;}
            if(lvls[member.id]<config.onelvl) text=config.zerolvlname
            if(lvls[member.id]>config.onelvl) text=config.onelvlname;
            if(lvls[member.id]>config.twolvl) text=config.twolvlname;
            if(lvls[member.id]>config.triolvl) text=config.triolvlname;
            if(lvls[member.id]>config.fourlvl) text=config.fourlvlname;
            if(lvls[member.id]>config.fivelvl) text=config.fivelvlname;
            if(lvls[member.id]>config.sixlvl) text=config.sixlvlname;
            if(lvls[member.id]>config.sevenlvl) text=config.sevenlvlname;
            if(lvls[member.id]>config.eightlvl) text=config.eightlvlname;
            if(lvls[member.id]>config.ninelvl) text=config.ninelvlname;
            if(lvls[member.id]>config.tenlvl) text=config.tenlvlname;
            const embed = new Discord.RichEmbed()
            .setColor('0080FF')
            .setAuthor(`[${config.prefix}lvl]`)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .addField("Очки пользователя", lvls[member.id], true)
            .addField("Звание пользователя", text, true)
            message.channel.send(embed).then(msg => msg.delete(5000));
            return;
        }
    }

    if(commandName == "setlvl"){
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}setlvl]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        if(!args[0]){
            color = 16711680;
            title = `[${config.prefix}setlvl]`;
            text = `Вы не упомянули пользователя!`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        if(!args[1]){
            color = 16711680;
            title = `[${config.prefix}setlvl]`;
            text = `Введите количество очков!`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        let setvalue = parseFloat(args[1]);
        lvls[member.id]=setvalue;
        color = '00FF89';
        title = `[${config.prefix}setlvl]`;
        text = `Вы установили у пользователя ${member} количество очков: ${setvalue}!`;
        message.channel.send(infomessage(color, title, text));
        return
    }

    if(commandName == "rwarnings"){
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['owner'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}rwarnings]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!member){
            color = 16777215;
            title = `[${config.prefix}rwarnings]`;
            text = `У вас удалены все предупреждения!`;
            message.channel.send(infomessage(color, title, text));
            delete infobanlist[message.author.id];
            return;
        }
        delete infobanlist[member.id];
        color = 16734464;
        title = `[${config.prefix}rwarnings]`;
        text = `Все предупреждения у пользователя ${member} удалены!`;
        message.channel.send(infomessage(color, title, text));
        return;
    }

    if(commandName == "warnings"){
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!member){
            if(!infobanlist[message.author.id]){
                color = 16777215;
                title = `[${config.prefix}warnings]`;
                text = `У вас  **0** предупреждений(я/е)!`;
                message.channel.send(infomessage(color, title, text));
            return;
            }
            color = 16777215;
            title = `[${config.prefix}warnings]`;
            text = `У вас  **${infobanlist[message.author.id]}** предупреждений(я/е)!`;
            message.channel.send(infomessage(color, title, text));
            return;
        }else{
            if(!infobanlist[member.id]){
                color = 16777215;
            title = `[${config.prefix}warnings]`;
            text = `У пользователя ${member},  **0** предупреждений(я/е)!`;
            message.channel.send(infomessage(color, title, text));
            return;
            }
            color = 16777215;
            title = `[${config.prefix}warnings]`;
            text = `У пользователя ${member},  **${infobanlist[member.id]}** предупреждений(я/е)!`;
            message.channel.send(infomessage(color, title, text));
        }
        return;
    }

    if(commandName == "addmat") {
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}addmat]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        var replace = /\[(.*?)\]/ism;
        var matches = replace.exec(message.content); 
        if(!matches){
            color = 16734464;
            title = `[${config.prefix}addmat]`;
            text = `Используйте ${config.prefix}addmat [слово]!`;
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(badwordslist.indexOf("^"+matches[1]+"$") == -1){
        	badwordslist.push("^"+matches[1]+"$");
        	color = 16711680;
            title = `[${config.prefix}addmat]`;
            text = `Слово было добавлено в список запрещённых слов!`;
            message.channel.send(infomessage(color, title, text));
        	return;
        }else{
        	color = 16711680;
            title = `[${config.prefix}addmat]`;
            text = `Это слово уже есть в списке запрещённых слов!`;
            message.channel.send(infomessage(color, title, text));
        	return;
        }
    }
    if(commandName == "unmute"){
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}unmute]`;
            text = language.error1.replace('{0}', prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute){
            color = 16734464;
            title = `[${config.prefix}unmute]`;
            text = `Используйте ${config.prefix}unmute @user!`;
            message.channel.send(infomessage(color, title, text));
            return
        }else{
            color = 16734464;
            title = `[${config.prefix}unmute]`;
            text = `Пользователь убран из мута (${member})!\nУ него ${infobanlist[member.id]} предупреждений(я)! Бан даётся при ${config.warningcount} предупреждениях!`;
            message.channel.send(infomessage(color, title, text));
            let role = client.guilds.get(config.serverid).roles.find('name', config.muterol).id;
            member.removeRole(role);
            delete mutedlist[member.id];
            if(infobanlist[member.id] >= config.warningcount){
		        member.ban();
		        color = 16734464;
		        title = `[${config.prefix}unmute]`;
		        text = `${member} забанен на сервере!\nЕго ID: ${member.id}`;
		        message.channel.send(infomessage(color, title, text));
		        delete infobanlist[member.id];
		        return true;
		    }
        }
        return;
    }
    
    if(commandName == "muted") {
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        var text = '';
        for (var key in mutedlist) {
            text += `\nПользователь <@${key}> сидит ещё ${ms(mutedlist[key])}`;
        }
        if(text == ""){
            color = 5504768;
            title = `[${config.prefix}muted]`;
            text = `Пользователей в муте нет!`;
            message.channel.send(infomessage(color, title, text));
        } else {
            color = 5504768;
            title = `[${config.prefix}muted]`;
            text = `${text}`;
            message.channel.send(infomessage(color, title, text));
        }
        return;
    }
    if(commandName == "github"){
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        color = 5504768;
        title = `[${config.prefix}github]`;
        text = `\nМой github - [жми](https://github.com/cheesegaproj/chatbot)`;
        message.channel.send(infomessage(color, title, text));
        return;
    }
    
    if(commandName == "kick"){
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}kick]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute){
            color = 16711680;
            title = `[${config.prefix}kick]`;
            text = `Используйте ${config.prefix}kick @user`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        member.kick()
        .then(() => console.log(`Kicked ${member.displayName}`));
        color = 16734464;
        title = `[${config.prefix}kick]`;
        text = `${member} кикнут с сервера!`;
        message.channel.send(infomessage(color, title, text));
        return;
    }

    if(commandName == "ban"){
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}ban]`;
            text = language.error1.replace('{0}', prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute){
            color = 16711680;
            title = `[${config.prefix}ban]`;
            text = `Используйте ${config.prefix}ban @user`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        member.ban()
        .then(() => console.log(`Banned ${member.displayName}`));
        color = 16734464;
        title = `[${config.prefix}ban]`;
        text = `${member} забанен на сервере!\nЕго ID: ${member.id}`;
        message.channel.send(infomessage(color, title, text));
        return;
    }

    if (commandName == "unban") {
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}unban]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        const user = args[0];
        if(!args[0]){
            color = 16711680;
            title = `[${config.prefix}unban]`;
            text = `Используйте ${config.prefix}ban @user`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        message.guild.unban(user);
        console.log(`Unbanned ${user}`);
        color = 16734464;
        title = `[${config.prefix}unban]`;
        text = `${user} разбанен на сервере!`;
        message.channel.send(infomessage(color, title, text));
        return;  
    }
    if(commandName == "rainbow"){
        member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}rainbow]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
            if(!args[0]){
                color = 16711680;
                title = `[${config.prefix}rainbow]`;
                text = `Вы не упомянули пользователя!`;
                message.channel.send(infomessage(color, title, text));
                return;
            }else{
                let role = client.guilds.get(config.serverid).roles.find('name', config.rainbowroles).id;
                member.removeRole(role);
                member.addRole(role);
                color = 16729856;
                title = `[${config.prefix}rainbow]`;
                text = `Радужная роль была убрана или же выдана пользователю ${member}!`;
                message.channel.send(infomessage(color, title, text));
                return;
            }
        }
    
    if(commandName == "coin"){
    	time = 5;
    	message.delete(5000);      
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        var rand = Math.floor(Math.random() * (2 - 1 + 1)) + 0;
        if(cooldown.has(message.author.id)) {
            return message.reply(`жди ${time} секунд для повтора команды!`).then(msg => msg.delete(5000));
        }
            cooldown.add(message.author.id);
            setTimeout(() => {
            cooldown.delete(message.author.id)
        }, time * 1000)
        if(rand == "0"){
            const embed = new Discord.RichEmbed()
                .setColor(14286592)
                .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
                .setThumbnail("https://images-ext-1.discordapp.net/external/psw8bjb7MLk5ifrtsyYLtYf_UORozzkQrctGwklKc7U/https/i.imgur.com/ZyCwWuE.png")
                .addField("Coin", "\nВы проиграли. Отнимаем у вас 50 опыта!")
                message.channel.send(embed).then(msg => msg.delete(5000));
            	lvls[message.author.id]=lvls[message.author.id]-50;
            	if(lvls[message.author.id]<0) lvls[message.author.id]=0;
        }
        if(rand == '1'){
            const embed = new Discord.RichEmbed()
                .setColor(14286592)
                .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
                .setThumbnail("https://images-ext-1.discordapp.net/external/0Aqs6FQriCBitmkZqMNBhedGhVM-J8wDVPnHQhFhdgQ/https/i.imgur.com/9FsWNZk.png")
                .addField("Coin", "\nВы выиграли. Начисляем вам 50 опыта!")
            message.channel.send(embed).then(msg => msg.delete(5000));
            lvls[message.author.id]+=50;
        }
        return
    }

    if(commandName == "report"){
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        let user = message.guild.member(message.mentions.users.first());
        if(!user){
            color = 16711680;
            title = `[${config.prefix}report]`;
            text = `Вы не упомянули пользователя и не написали причину !report @user [reason]`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        var replace = /\[(.*?)\]/ism;
        var reportuser = replace.exec(message.content);
        if(!reportuser){
            color = 16711680;
            title = `[${config.prefix}report]`;
            text = `Вы не написали причину !report @user [reason]`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        channel = message.guild.channels.find('name', config.reportchannel);
        const embed = new Discord.RichEmbed()
            .setColor(13632027)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .addField("Нарушитель", `<@${user.id}>`)
            .addField("Канал", `${message.channel}`)
            .addField("Отправитель", `<@${message.author.id}>`)
            .addField("Текст репорта", `**${reportuser[1]}**\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            channel.send(embed);
            message.reply(`ваша жалоба на пользователя отправлена! Ваше сообщение с командой ${config.prefix}report было удалено.`);
            message.delete(message.author.id);
        return;
    }
    if(commandName == "weather"){
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(!args[0]){
            color = 16711680;
            title = `[${config.prefix}weather]`;
            text = `Укажите город! ${config.prefix}weather Город`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        weather.find({search: args[0], degreeType: 'C'}, function(err, result) { //degreeType - тип градуса(С - цельсий, F - фаренгейт)
        if(err) console.log(err);
        if(!result[0]){
            color = 16711680;
            title = `[${config.prefix}weather]`;
            text = `Город не был найден!`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        // Переменные
        var current = result[0].current;
        var location = result[0].location;
            
        const weather = new Discord.RichEmbed()
            .setDescription(`**${current.skytext}**`)
            .setAuthor(`Погода в ${current.observationpoint}`)
            .setThumbnail(current.imageUrl)
            .setColor(16777215)
            .addField('Температура',`${current.temperature} градусов`, true)
            .addField('Ветер',current.winddisplay, true)
            .addField('Влажность', `${current.humidity}%\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`, true)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg");
            message.channel.send(weather);
        });
        return;
    }

    if(commandName == "admins"){
        var date = new Date();         
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
    	color = 16777215;
    	title = `[${config.prefix}admins]`;
        text =  `**Список пользователей, которые добавлены в администраторы бота:**\n`;
		perms['root'].forEach(function(item, i, arr) {
  			text += (`\n<@${item}>`);
		});
		message.channel.send(infomessage(color, title, text));
    	return;
	}
	if(commandName == "restart"){
		console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
		if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}restart]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
	message.delete()
            .then(message => client.destroy())
            .then(() => client.login(config.token))
            .then(() => console.log("Restarting the bot..."));
        color = 16711680;
    	title = `[${config.prefix}restart]`;
    	text = `**Внимание!** Перезагрузка бота!`;
    	message.channel.send(infomessage(color, title, text));
        return;
    }

    if(commandName == 'roulette'){
        time = 10;
        stake = [1, 2, 3];
        let setvalue = parseFloat(args[0]);
        let setvalue1 = parseFloat(args[1]);
        message.delete(5000);
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(cooldown.has(message.author.id)) {
            return message.reply(`жди ${time} секунд для повтора команды!`).then(msg => msg.delete(5000));
        }
            cooldown.add(message.author.id);
            setTimeout(() => {
            cooldown.delete(message.author.id)
        }, time * 1000)
        if(!args[0]){
            color = 16711680;
            title = `[${config.prefix}roulette]`;
            text = 'Укажите на что хотите поставить!\n🍦 — 1\n🍪 — 2\n🍩 — 3';
            message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
            return;
        }
        if(!args[1]){
            color = 16711680;
            title = `[${config.prefix}roulette]`;
            text = 'Укажи сумму ставки!';
            message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
            return;
        }
        if(stake.indexOf(setvalue) == -1){
            color = 16711680;
            title = `[${config.prefix}roulette]`;
            text = 'Пишите значение от 1 до 3!'
            message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
            return;
        }
        if(lvls[message.author.id]<setvalue1) return message.reply('у тебя не хватает опыта!').then(msg => msg.delete(300));
        var rand = 1 + Math.random() * (2 - 1 + 1)
        rand = Math.round(rand);
        text = '🍪🍩🍦\n⚪⏫⚪';
        message.channel.send(text)
        .then(function (msg){
            if(rand >= 1){msg.edit('🍩🍦🍪\n⚪⏫⚪');}
            if(rand >= 2){msg.edit('🍦🍪🍩\n⚪⏫⚪');}
            if(rand >= 3){msg.edit('🍪🍩🍦\n⚪⏫⚪');}
            msg.delete(5000);
            if((setvalue) == rand){
                color = '00ffff';
                title = `[${config.prefix}roulette]`;
                text = `Ты выиграл! Тебе начисляется ${args[1]*1.5} очков опыта!`;
                message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
                lvls[message.author.id]+=(setvalue1*1.5);
            }else{
                color = 'f984ef';
                title = `[${config.prefix}roulette]`;
                text = `Ты проиграл! У тебя отнимается ${args[1]} очков опыта!`;
                message.channel.send(infomessage(color, title, text)).then(msg => msg.delete(5000));
                lvls[message.author.id] = lvls[message.author.id]-setvalue1;
                if(lvls[message.author.id]<0) lvls[message.author.id] = 0;
            }
        })
        return;
    }

    if(commandName == 'say'){
        var date = new Date();
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
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
		    .setAuthor(`░▒▓▢Attention!▢▓▒░`)
            .setColor(16711680)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .setDescription(`${sayMessage}\nАвтор объявления: ${message.author}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`);
		channel.send(embed);
        return;
    }

    if(commandName == 'sendlog'){
    	console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${config.prefix}sendlog]`;
            text = language.error1.replace('{0}', config.prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        if(!args[0]) return message.reply(`выберете дату. Она должна быть в формате день.месяц.год. Например ${Day}.${Month}.${Year}`);
        message.reply('лог отправлен вам в личные сообщения.');
        message.author.send(`Лог чата выбранной вами даты:`, {
            files: [
                `log/${args[0]}.txt`
            ]
        })
        return
    }

	if(commandName == 'play'){
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(config.lvlsonoff == 'on'){if(lvls[message.author.id]<config.fourlvl) return message.reply("у вас слишком маленький лвл!");}
        let suffix = message.content.split(" ").slice(1).join(" ");
        if (!suffix) return message.channel.send(`Пожалуйста используйте ${config.prefix}play название трека/ссылка`);
        if (!client.voiceConnections.get(message.author.id)) {
          if (message.channel.type !== 'text'){
          	color = 16711680;
            title = `[${config.prefix}rainbow]`;
            text = `Ты не в голосовом канале`;
            message.channel.send(infomessage(color, title, text));
            return;
          }
          const { voiceChannel } = message.member;
          if (!voiceChannel){
          	color = 16711680;
            title = `[${config.prefix}rainbow]`;
            text = `Ты не в голосовом канале`;
            message.channel.send(infomessage(color, title, text));
            return;
          }
          voiceChannel.join();
        }
        playSong(message, getQueue(message.guild.id), suffix);
        return;
    }
    if(commandName == "skip"){       
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(config.lvlsonoff == 'on'){if(lvls[message.author.id]<config.fourlvl) return message.reply("у вас слишком маленький лвл!");}
        const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${config.prefix}rainbow]`;
          text = `Ты не в голосовом канале`;
          message.channel.send(infomessage(color, title, text));
          return;
        }
        let player = client.voiceConnections.get(message.guild.id);
        if(!player || !player.speaking){
            color = 6143311;
            title = "MusicSound";
            text = "Плеер не играет!";
            message.channel.send(infomessage(color, title, text));
            return;
        }
        player.dispatcher.end();
        return;
    }
    if(commandName == "pause"){       
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(config.lvlsonoff == 'on'){if(lvls[message.author.id]<config.fourlvl) return message.reply("у вас слишком маленький лвл!");}
        const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${config.prefix}rainbow]`;
          text = `Ты не в голосовом канале`;
          message.channel.send(infomessage(color, title, text));
          return;
        }
        let player = client.voiceConnections.get(message.guild.id);
        if(!player || !player.speaking){
            color = 6143311;
            title = "MusicSound";
            text = "Плеер не играет!";
            message.channel.send(infomessage(color, title, text));
        }
            color = 6143311;
            title = "MusicSound";
            text = "Пауза включена!";
            message.channel.send(infomessage(color, title, text));
        player.dispatcher.pause();
        return;
    }
    if(commandName == "resume"){    
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(config.lvlsonoff == 'on'){if(lvls[message.author.id]<config.fourlvl) return message.reply("у вас слишком маленький лвл!");}
        const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${config.prefix}resume]`;
          text = `Ты не в голосовом канале`;
          message.channel.send(infomessage(color, title, text));
          return;
        }
        let player = client.voiceConnections.get(message.guild.id);
        color = 6143311;
        title = "MusicSound";
        text = "Продолжаем!";
        message.channel.send(infomessage(color, title, text));
        player.dispatcher.resume();
        return;
    }
    if(commandName == "volume"){   
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(config.lvlsonoff == 'on'){if(lvls[message.author.id]<config.fourlvl) return message.reply("у вас слишком маленький лвл!");}
        const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
            title = `[${config.prefix}volume]`;
            text = `Ты не в голосовом канале`;
            message.channel.send(infomessage(color, title, text));
            return;
        }
        let player = client.voiceConnections.get(message.guild.id);
        if(!args[0]){
            color = 6143311;
            title = "MusicSound";
            text = "Укажите громкость!";
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0]>100){
            color = 6143311;
            title = "MusicSound";
            text = "Значение громкости указывается от 0 до 100!";
            message.channel.send(infomessage(color, title, text));
            return;
        }
        color = 6143311;
        title = "MusicSound";
        text = `Установлена новая громкость ${args[0]}!`;
        message.channel.send(infomessage(color, title, text));
        volume = args[0]/100;
        player.dispatcher.setVolume(volume);
        return
    }
    if(commandName == "queue"){     
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
    	color = 6143311;
        title = "MusicSound";
        text = "";
        var queue = getQueue(config.serverid);
        queue.forEach(function(element, index, array){
            text += '\n'+"`"+(index+1)+'.` `'+Math.floor(element.seconds/60)+':'+element.seconds%60+'`'+' '+`${element.title}`;
        })
        const embed = new Discord.RichEmbed()
            .setColor(16734464)
            .setAuthor(title)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .setDescription(`${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        message.channel.send(embed);
        return
    }
    if(commandName == "remove") {
        console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(config.lvlsonoff == 'on'){if(lvls[message.author.id]<config.fourlvl) return message.reply("у вас слишком маленький лвл!");}
        const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${config.prefix}remove]`;
          text = `Ты не в голосовом канале`;
          message.channel.send(infomessage(color, title, text));
          return;
        }
        if(removeMusic(message, args)){
        	color = 6143311;
            title = "MusicSound";
            text = "Трек удалён из очереди!";
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(!removeMusic(message, args)){
        	color = 6143311;
            title = "MusicSound";
            text = "Трек не удалён из очереди!";
            message.channel.send(infomessage(color, title, text));
            return;
        }
    }
    console.log(`[date: ${Year}-${Month}-${Day}|${Hour}:${Minutes}] — ${message.author.username}(${message.author.id}) send command ${commandName} for bot! This command off in bot or undefined`);
    color = 16711680;
    title = `[Error]`;
    text = `Эта комнанда не найдена! Напишите ${config.prefix}info чтобы узнать список команд`;
    message.channel.send(infomessage(color, title, text));
});

function removeMusic(msg, args) {
    g = parseInt(args[0] - 1);
    queue = getQueue(config.serverid);
    if(queue[g] == undefined) return false;
    fs.unlinkSync('./music/'+queue[g].toplay)
    queue.splice(g, 1);
    return true;
}

async function purge(message, args) {
    if(!args[0]){
        color = 16711680;
        title = `[${config.prefix}clean]`;
        text = `Введи число сообщений, которое хочешь удалить (0-100) ${config.prefix}clear 100`;
        message.channel.send(infomessage(color, title, text));
        return
    }
    const fetched = await message.channel.fetchMessages({limit: args[0]});
    var messages = [];
    fetched.forEach(function(element, index, array) {
        if(element.author.id == client.user.id || element.content.startsWith(config.prefix)) messages.push(element);
    });
    messages.forEach(function(element, index, array) {
        message.channel.fetchMessage(element.id)
            .then(message => message.delete())
    });
}

function infomessage(color, title, text) {
        const embed = new Discord.RichEmbed()
            .setColor(color)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
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
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .addField(`[${config.prefix}mute]`, `Используйте ${config.prefix}mute @user 1s/m/h/d!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        message.channel.send(embed);
        return
    }
    let mutetime = args[1];
    if(!mutetime){
        const embed = new Discord.RichEmbed()
            .setColor(16734464)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")        
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
    let role = client.guilds.get(config.serverid).roles.find('name', config.muterol).id;
    if(!auto) { mod = message.author; } else { mod = client.user; }
    tomute.addRole(role).then(function() {
        let user = client.guilds.get(config.serverid).members.get(tomute.id).user;
        const embed = new Discord.RichEmbed()
            .setColor(13632027)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .addField("User", `<@${tomute.id}>`, true)
            .addField("Moderator", `<@${mod.id}>`, true)
            .addField("Reason", `${reason}`, true)
            .addField("Duration", `${mutetime}`, true)
            if(config.chatlog == 'on'){
        		fs.appendFileSync(`log/${Day}.${Month}.${Year}.txt`, `[${Year}-${Month}-${Day}|${Hour}:${Minutes}|${message.channel.name}] MUTED USER ${tomute.user.username}#${tomute.user.discriminator}! REASON: ${reason}. TIME: ${mutetime}. MODERATOR: ${mod.tag}`+'\n',  "utf-8");
    		}
            message.channel.send(embed);
        if(ms(mutetime) != 0) mutedlist[tomute.id] = ms(mutetime);
        mutedlist[tomute.id] = ms(mutetime);
        if(config.warningcountonoff == 'on'){
            if(!infobanlist[tomute.id]) infobanlist[tomute.id] = 0;
            infobanlist[tomute.id] += 1;
            if(config.lvlsonoff = 'on'){lvls[tomute.id] -=5000;}
            if(lvls[tomute.id]<0) lvls[tomute.id]=0;
        }else{
            if(!infobanlist[tomute.id]) infobanlist[tomute.id] = 0;
        }
        return;
    });
}

function checkForMatWords(message) {
    content = message.content.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    arr = content.split(" ");
    for (var key in badwordslist) {
        pattern = new RegExp(badwordslist[key], "gi");
        for (var key in arr) {
            if(arr[key].search(pattern) != -1) {
                data = [message.author.id, config.automutetime, 'Нецензурные выражения'];
                Mute(message, data, true);
                message.delete(5000);
                return;
            }
        }
    }
}

function UnMute(channel, id) {
    if(!IsAuth) return false;
    let role = client.guilds.get(channel).roles.find('name', config.muterol).id;
    member = client.guilds.get(channel).members.get(id);
    try {
        client.guilds.get(channel).members.get(id).removeRole(role);
    } catch(err) {
        return false;
    }
    if(infobanlist[member.id] >= config.warningcount){
        member.ban();
        color = 16734464;
        title = `[${config.prefix}unmute]`;
        text = `${member} забанен на сервере!\nЕго ID: ${member.id}`;
        var channel = client.guilds.get(channel).channels.find('id', config.generalchatid);
        channel.send(infomessage(color, title, text));
        delete infobanlist[member.id];
        return true;
    }
    color = 16734464;
    title = `[${config.prefix}unmute]`;
    text = `Пользователь убран из мута(<@${id}>)!\nУ него ${infobanlist[id]} предупреждений(я)! Бан даётся при ${config.warningcount} предупреждениях!`;
    var channel = client.guilds.get(channel).channels.find('id', config.generalchatid);
    channel.send(infomessage(color, title, text));
    return true;
}

function minusMutedList() {
    for (var key in mutedlist) {
        if(mutedlist[key] <= 1) { 
            mutedlist[key] = mutedlist[key] - 1;
            if(UnMute(config.serverid, key)) delete mutedlist[key];
        } else {
            mutedlist[key] = mutedlist[key] - 1;
        }
    }
}

setInterval(minusMutedList, 1);

function saveMutedList() {
    fs.writeFile('muted.json', JSON.stringify(mutedlist), function() {/*console.log(whitelist);*/});
}
setInterval(saveMutedList, 2000);
function savelvl() {
    fs.writeFile('lvls.json', JSON.stringify(lvls), function() {/*console.log(whitelist);*/});
}
setInterval(savelvl, 1000);

function saveBadWordsList() {
    fs.writeFile('words.json', JSON.stringify(badwordslist), function() {/*console.log(badwordslist);*/});
}
setInterval(saveBadWordsList, 1000);

function saveinfobanlist() {
    fs.writeFile('infoban.json', JSON.stringify(infobanlist), function() {/*console.log(badwordslist);*/});
}
setInterval(saveinfobanlist, 1000);

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
      	msg.channel.send(infomessage(color, title, text));
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
      	msg.channel.send(infomessage(color, title, text));
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
    msg.channel.send(infomessage(color, title, text));
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
    msg.channel.send(infomessage(color, title, text));
    client.voiceConnections.get(msg.guild.id).disconnect();
  }
}


//logs
client.on('guildMemberRemove', member => {
    if(config.channellogonoff == 'on'){
        var channel = client.guilds.get(config.serverid).channels.find('name', config.channellog);
        const embed = new Discord.RichEmbed()
            .setAuthor(`${member.user.username}#${member.user.discriminator}`, member.user.avatarURL)
            .setColor(16777215)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .setDescription(`Пользователь вышел с сервера.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        channel.send(embed);
    }
})
client.on('channelCreate', channel => {
    if(config.channellogonoff == 'on'){
        var channel = client.guilds.get(config.serverid).channels.find('name', config.channellog);
        const embed = new Discord.RichEmbed()
            .setAuthor(`Создание канала ${channel.name}`)
            .setColor(16777215)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .setDescription(`Был создан канал **${channel.name}**. Его тип: ${channel.type}.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        channel.send(embed);
    }
})
client.on('channelDelete', channel =>{
    if(config.channellogonoff == 'on'){
        var channel1 = client.guilds.get(config.serverid).channels.find('name', config.channellog);
        const embed = new Discord.RichEmbed()
            .setAuthor(`Удаление канала ${channel.name}`)
            .setColor(16777215)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .setDescription(`Был удален канал **${channel.name}**. Его тип: ${channel.type}.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        channel1.send(embed);
    }
})
client.on('channelUpdate', channel => {
    if(config.channellogonoff == 'on'){
        var channel2 = client.guilds.get(config.serverid).channels.find('name', config.channellog);
        const embed = new Discord.RichEmbed()
            .setAuthor(`Обновление канала ${channel.name}`)
            .setColor(16777215)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .setDescription(`Был обновлен канал **${channel.name}**. Его тип: ${channel.type}.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        channel2.send(embed);
    }
})
client.on('roleUpdate', role => {
    if(config.channellogonoff == 'on'){
        var channel = client.guilds.get(config.serverid).channels.find('name', config.channellog);
        if(role.name != config.rainbowroles){
            const embed = new Discord.RichEmbed()
                .setAuthor(`Обновление роли ${role.name}`)
                .setColor(16777215)
                .setFooter("Coder - cheesega. Version: 2.8", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
                .setDescription(`Была обновлена роль **${role.name}**.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            channel.send(embed);
        }
    }
})
client.on('roleDelete', role => {
    if(config.channellogonoff == 'on'){
        var channel = client.guilds.get(config.serverid).channels.find('name', config.channellog);
        const embed = new Discord.RichEmbed()
            .setAuthor(`Удаление роли ${role.name}`)
            .setColor(16777215)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .setDescription(`Была удалена роль **${role.name}**.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        channel.send(embed);
    }
})
client.on('guildBanAdd', (guild,user) => {
    if(config.channellogonoff == 'on'){
        var channel = client.guilds.get(config.serverid).channels.find('name', config.channellog);
        const embed = new Discord.RichEmbed()
            .setAuthor(`Новый бан`)
            .setColor(16777215)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .setDescription(`**${user.username}#${user.discriminator}** был забанен на сервере.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        channel.send(embed);
    }
})
client.on('guildBanRemove', (guild,user) => {
    if(config.channellogonoff == 'on'){
        var channel = client.guilds.get(config.serverid).channels.find('name', config.channellog);
        const embed = new Discord.RichEmbed()
            .setAuthor(`Разбан`)
            .setColor(16777215)
            .setFooter("Coder - cheesega. Version: 2.8", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
            .setDescription(`**${user.username}#${user.discriminator}** был разбанен на сервере.\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        channel.send(embed);
    }
})
//logs end
