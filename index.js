const Discord = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const request = require('request');
const ytdl = require('ytdl-core');
const YTsearch = require('youtube-search');
const queues = {};
var volume = 30/100;
const language = require('./language.json');
const { prefix, 
    token, 
    serverid, 
    rainbowroles,
    rainbowrolesonoff,
    muterol, 
    reportchannel, 
    generalchatid, 
    defaultrole, 
    defaultroleonoff, 
    welcome, 
    welcomeonoff,
    warningcount, 
    warningcountonoff,
    automutetime, 
    yt_api_key, 
    lvlsonoff,
    zerolvlname,
    onelvl, 
    onelvlname, 
    twolvl, 
    twolvlname,
    triolvl,
    triolvlname,
    fourlvl,
    fourlvlname,
    fivelvl,
    fivelvlname,
    sixlvl,
    sixlvlname,
    sevenlvl,
    sevenlvlname,
    eightlvl,
    eightlvlname,
    ninelvl,
    ninelvlname,
    tenlvl,
    tenlvlname,
    giverainbowlvlten} = require('./config.json');
const opts = {
  maxResults: 4,
  key: yt_api_key
};
const client = new Discord.Client();
var lvls = JSON.parse(fs.readFileSync('lvls.json'));
var mutedlist = JSON.parse(fs.readFileSync('muted.json'));
var infobanlist = JSON.parse(fs.readFileSync('infoban.json'));
var badwordslist = JSON.parse(fs.readFileSync('words.json'));
var perms = require('./permissions.js');
//var perms = JSON.parse(fs.readFileSync('permissions.json'));
var weather = require('weather-js');
var IsAuth = false;
/* RAINBOW START */var interval;
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
    if(rainbowrolesonoff == 'on'){
    if(!IsAuth) return;
        let server = client.guilds.get(serverid);
        let theRole = server.roles.find('name', rainbowroles);
        theRole.setColor(rainbow[place]).catch(console.error);
        if(place == (size - 1)) {
            place = 0;
        } else {
            place++;
        }
    }
}
setInterval(() => { discoRole(); }, 150);

client.login(token).catch(err => {
           // handle rejection here
        });


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!\nHello! I am moderation bot :) 
My creator — cheesega
Version: 2.7
github — https://github.com/cheesegaproj
Discord — cheesega#9496
Hmm... You are ready? Go!`);
    IsAuth = true;
});
ready=[`send me ${prefix}info`, 'coder - cheesega', 'musicbot', 'moderationbot', 'games', 'github.com/cheesegaproj'];
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
    if(defaultroleonoff == "on"){
        let role = client.guilds.get(serverid).roles.find('name', defaultrole).id;
        member.addRole(role);
    }else if(defaultroleonoff == "off"){
        console.log("addrole new member: off");
    }
    if(mutedlist[member.id]) {
        let muterole = client.guilds.get(serverid).roles.find('name', muterol);
        member.addRole(muterol.id);
    }
    var newUsers = '';
    const guild = member.guild;
    if(welcomeonoff == 'on'){
        const defaultChannel = guild.channels.find(c=> c.permissionsFor(guild.me).has("SEND_MESSAGES"));
        color = 16777215;
        title = '[welcome!]';
        text = `${member}, ${welcome}`;
        defaultChannel.send(infomessage(color, title, text));
    }
})

client.on('message', message => {
    if(message.author === client.user) return;
    if (!message.content.startsWith(prefix)){
        checkForMatWords(message);
        if(lvlsonoff == 'on'){
            if(!lvls[message.author.id]) lvls[message.author.id] = 0;
            lvls[message.author.id]+=0.5;
            if(giverainbowlvlten == 'on'){
                if(lvls[message.author.id]>tenlvl){
                    member = message.guild.member(message.author);
                    let role = client.guilds.get(serverid).roles.find('name', rainbowroles).id;
                    member.addRole(role);
                }
            }
        }
        return;
    };
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    if(commandName == "info") {
        if(!args.length) {/*
            color = 16777215;
            title = `[${prefix}info]`;
            text = `Cписок моих команд(чтобы узнать информацию о команде, пиши, например, **${prefix}info 1**):\n**1. ${prefix}radmin\n2. ${prefix}mute\n3. ${prefix}addmat\n4. ${prefix}unmute\n5. ${prefix}muted\n6. ${prefix}github\n7. ${prefix}kick\n8. ${prefix}ban\n9. ${prefix}unban\n10. ${prefix}rainbow\n11. ${prefix}coin\n12. ${prefix}exit\n13. ${prefix}report\n14. ${prefix}warnings\n15. ${prefix}rwarnings\n16. ${prefix}admin\n17. ${prefix}weather\n18. ${prefix}clear\n19. ${prefix}clean\n20. ${prefix}admins\n21. ${prefix}restart\n22. ${prefix}play\n23. ${prefix}pause\n24. ${prefix}resume\n25. ${prefix}skip\n26 ${prefix}volume\n27. ${prefix}remove\n28. ${prefix}queue**`;
           */
           text = `${language.oneinfo} **${prefix}info 1**):\n**1. ${prefix}mute\n2. ${prefix}addmat\n3. ${prefix}unmute\n4. ${prefix}muted\n5. ${prefix}github\n6. ${prefix}kick\n7. ${prefix}ban\n8. ${prefix}unban\n9. ${prefix}rainbow\n10. ${prefix}coin\n11. ${prefix}exit\n12. ${prefix}report\n13.${prefix}warnings\n14. ${prefix}rwarnings**`;
           console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
		   const embed = new Discord.RichEmbed()
		    .setAuthor(`[${prefix}info]`)
            .setColor(16777215)
            .setFooter("Coder - cheesega. Version: 2.7", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
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
                        embed.setDescription(`${language.oneinfo} **${prefix}info 1**):\n**1. ${prefix}mute\n2. ${prefix}addmat\n3. ${prefix}unmute\n4. ${prefix}muted\n5. ${prefix}github\n6. ${prefix}kick\n7. ${prefix}ban\n8. ${prefix}unban\n9. ${prefix}rainbow\n10. ${prefix}coin\n11. ${prefix}exit\n12. ${prefix}report\n13.${prefix}warnings\n14. ${prefix}rwarnings**\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`);
                        msg.edit(embed)
                    })
                    
                    forwards.on('collect', r => {
                        embed.setDescription(`${language.oneinfo} **${prefix}info 1**):\n**15. ${prefix}weather\n16. ${prefix}clear\n17. ${prefix}clean\n18. ${prefix}admins\n19. ${prefix}restart\n20. ${prefix}play\n21. ${prefix}pause\n22. ${prefix}resume\n23. ${prefix}skip\n24 ${prefix}volume\n25. ${prefix}remove\n26. ${prefix}queue\n27. ${prefix}lvl\n28. ${prefix}setlvl**\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`);
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
            title = `[${prefix}info 1]`;
            text = language.info1.replace('{0}', prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            return;
        }
        if(args[0] == "2"){
            color = 16777215;
            title = `[${prefix}info 2]`;
            text = language.info2.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "3"){
            color = 16777215;
            title = `[${prefix}info 3]`;
            text = language.info3.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "4"){
            color = 16777215;
            title = `[${prefix}info 4]`;
            text = language.info4.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "5"){
            color = 16777215;
            title = `[${prefix}info 5]`;
            text = language.info5.replace('{0}', prefix);
            message.channel.send(infomessage(color, title, text));
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            return;
        }
        if(args[0] == "6"){
            color = 16777215;
            title = `[${prefix}info 6]`;
            text = language.info6.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "7"){
            color = 16777215;
            title = `[${prefix}info 7]`;
            text = language.info7.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "8"){
            color = 16777215;
            title = `[${prefix}info 8]`;
            text = language.info8.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "9"){
            color = 16777215;
            title = `[${prefix}info 9]`;
            text = language.info9.replace('{0}', prefix);
            text = text.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "10"){
            color = 16777215;
            title = `[${prefix}info 10]`;
            text = language.info10.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "11"){
            color = 16777215;
            title = `[${prefix}info 11]`;
            text = language.info11.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "12"){
            color = 16777215;
            title = `[${prefix}info 12]`;
            text = language.info12.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "13"){
            color = 16777215;
            title = `[${prefix}info 13]`;
            text = language.info13.replace('{0}', prefix);
            text = text.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "14"){
            color = 16777215;
            title = `[${prefix}info 14]`;
            text = language.info14.replace('{0}', prefix);
            text = text.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "15"){
            color = 16777215;
            title = `[${prefix}info 15]`;
            text = language.info15.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "16"){
            color = 16777215;
            title = `[${prefix}info 16]`;
            text = language.info16.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "17"){
            color = 16777215;
            title = `[${prefix}info 17]`;
            text = language.info17.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "18"){
            color = 16777215;
            title = `[${prefix}info 18]`;
            text = language.info18.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "19"){
            color = 16777215;
            title = `[${prefix}info 19]`;
            text = language.info19.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "20"){
            color = 16777215;
            title = `[${prefix}info 20]`;
            text = language.info20.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "21"){
            color = 16777215;
            title = `[${prefix}info 21]`;
            text = language.info21.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "22"){
            color = 16777215;
            title = `[${prefix}info 22]`;
            text = language.info22.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "23"){
            color = 16777215;
            title = `[${prefix}info 23]`;
            text = language.info23.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "24"){
            color = 16777215;
            title = `[${prefix}info 24]`;
            text = language.info24.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "25"){
            color = 16777215;
            title = `[${prefix}info 25]`;
            text = language.info25.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "26"){
            color = 16777215;
            title = `[${prefix}info 26]`;
            text = language.info26.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "27"){
            color = 16777215;
            title = `[${prefix}info 27]`;
            text = language.info26.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(args[0] == "28"){
            color = 16777215;
            title = `[${prefix}info 28]`;
            text = language.info26.replace('{0}', prefix);
            console.log(`${message.author.username}(${message.author.id}) send command info for bot!`);
            message.channel.send(infomessage(color, title, text));
            return;
        }
    }
    if(commandName == "exit") {
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}exit]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
            client.destroy().then(process.exit);
            return;
        }
    if(commandName == "clean"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}clean]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }    
        async function clear() {
            if(!args[0]){
                color = 16711680;
                title = `[${prefix}clean]`;
                text = `Введи число сообщений, которое хочешь удалить (0-100) ${prefix}clean 100`;
                message.channel.send(infomessage(color, title, text));
                return
            }
            const fetched = await message.channel.fetchMessages({limit: args[0]});
            console.log(fetched.size + ' сообщений(е,я) найдено и удалено...');
            message.channel.bulkDelete(fetched).then(() => {
                color = 16777215;
                title = `[${prefix}clean]`;
                text = `Было удалено **${fetched.size}** сообщений(e/я)!`;
                message.channel.send(infomessage(color, title, text));
            }) 
        }clear();
    return;
};
    if(commandName == "clear") {
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}exit]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }

        purge(message, args);
        return;
    }
    if(commandName == "mute"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}exit]`;
            text = `У тебя нет прав для выполнения данной команды!`;
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
        if(!member){
            if(!lvls[message.author.id]){text=zerolvlname; lvls[message.author.id] = 0;}
            if(lvls[message.author.id]<onelvl) text=zerolvlname;
            if(lvls[message.author.id]>onelvl) text=onelvlname;
            if(lvls[message.author.id]>twolvl) text=twolvlname;
            if(lvls[message.author.id]>triolvl) text=triolvlname;
            if(lvls[message.author.id]>fourlvl) text=fourlvlname;
            if(lvls[message.author.id]>fivelvl) text=fivelvlname;
            if(lvls[message.author.id]>sixlvl) text=sixlvlname;
            if(lvls[message.author.id]>sevenlvl) text=sevenlvlname;
            if(lvls[message.author.id]>eightlvl) text=eightlvlname;
            if(lvls[message.author.id]>ninelvl) text=ninelvlname;
            if(lvls[message.author.id]>tenlvl) text=tenlvlname;
            const embed = new Discord.RichEmbed()
            .setColor('0080FF')
            .setAuthor(`[${prefix}lvl]`)
            .setFooter("Coder - cheesega. Version: 2.7", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
            .addField("Очки", lvls[message.author.id], true)
            .addField("Звание", text, true)
            message.channel.send(embed);
            return;
        }else{
            if(!lvls[member.id]){text=zerolvlname; lvls[message.author.id] = 0;}
            if(lvls[member.id]<onelvl) text=zerolvlname
            if(lvls[member.id]>onelvl) text=onelvlname;
            if(lvls[member.id]>twolvl) text=twolvlname;
            if(lvls[member.id]>triolvl) text=triolvlname;
            if(lvls[member.id]>fourlvl) text=fourlvlname;
            if(lvls[member.id]>fivelvl) text=fivelvlname;
            if(lvls[member.id]>sixlvl) text=sixlvlname;
            if(lvls[member.id]>sevenlvl) text=sevenlvlname;
            if(lvls[member.id]>eightlvl) text=eightlvlname;
            if(lvls[member.id]>ninelvl) text=ninelvlname;
            if(lvls[member.id]>tenlvl) text=tenlvlname;
            const embed = new Discord.RichEmbed()
            .setColor('0080FF')
            .setAuthor(`[${prefix}lvl]`)
            .setFooter("Coder - cheesega. Version: 2.7", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
            .addField("Очки пользователя", lvls[member.id], true)
            .addField("Звание пользователя", text, true)
            message.channel.send(embed);
            return;
        }
    }

    if(commandName == "setlvl"){
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}setlvl]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        if(!args[0]){
            color = 16711680;
            title = `[${prefix}setlvl]`;
            text = `Вы не упомянули пользователя!`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        if(!args[1]){
            color = 16711680;
            title = `[${prefix}setlvl]`;
            text = `Введите количество очков!`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        let setvalue = parseFloat(args[1]);
        lvls[member.id]=setvalue;
        color = '00FF89';
        title = `[${prefix}setlvl]`;
        text = `Вы установили у пользователя ${member} количество очков: ${setvalue}!`;
        message.channel.send(infomessage(color, title, text));
        return
    }

    if(commandName == "rwarnings"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['owner'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}rwarnings]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!member){
            color = 16777215;
            title = `[${prefix}rwarnings]`;
            text = `У вас удалены все предупреждения!`;
            message.channel.send(infomessage(color, title, text));
            delete infobanlist[message.author.id];
            return;
        }
        delete infobanlist[member.id];
        color = 16734464;
        title = `[${prefix}rwarnings]`;
        text = `Все предупреждения у пользователя ${member} удалены!`;
        message.channel.send(infomessage(color, title, text));
        return;
    }

    if(commandName == "warnings"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!member){
            if(!infobanlist[message.author.id]){
                color = 16777215;
                title = `[${prefix}warnings]`;
                text = `У вас  **0** предупреждений(я/е)!`;
                message.channel.send(infomessage(color, title, text));
            return;
            }
            color = 16777215;
            title = `[${prefix}warnings]`;
            text = `У вас  **${infobanlist[message.author.id]}** предупреждений(я/е)!`;
            message.channel.send(infomessage(color, title, text));
            return;
        }else{
            if(!infobanlist[member.id]){
                color = 16777215;
            title = `[${prefix}warnings]`;
            text = `У пользователя ${member},  **0** предупреждений(я/е)!`;
            message.channel.send(infomessage(color, title, text));
            return;
            }
            color = 16777215;
            title = `[${prefix}warnings]`;
            text = `У пользователя ${member},  **${infobanlist[member.id]}** предупреждений(я/е)!`;
            message.channel.send(infomessage(color, title, text));
        }
        return;
    }

    // if(commandName == "admin"){
    //     console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
    //      if(perms['root'].indexOf(message.author.id) == -1){
    //         color = 16711680;
    //         title = `[${prefix}admin]`;
    //         text = `У тебя нет прав для выполнения данной команды!`;
    //         message.channel.send(infomessage(color, title, text));
    //         console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
    //         return;
    //     }
    //     let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    //     if(!member){
    //         color = 16734464;
    //         title = `[${prefix}admin]`;
    //         text = `Используйте ${prefix}admin @user!`;
    //         message.channel.send(infomessage(color, title, text));
    //         return;
    //     }
    //     var zapros = `INSERT INTO bot.${table} (user, role) VALUES (${member.id}, 'root');`;
    //     mysqlzapros(zapros);
    //     checkbd();
    //     color = 16734464;
    //     title = `[${prefix}admin]`;
    //     text = `Пользователь ${member} добавлен в админы!`;
    //     message.channel.send(infomessage(color, title, text));
    //     return;
    // }
//DELETE FROM `bot`.`perms` WHERE  `ID`=00000000014;
    //     if(commandName == "radmin"){
    //         console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
    //          if(perms.indexOf(message.author.id) == -1){
    //             color = 16711680;
    //             title = `[${prefix}radmin]`;
    //             text = `У тебя нет прав для выполнения данной команды!`;
    //             message.channel.send(infomessage(color, title, text));
    //             console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
    //         return;
    //         }
    //         let member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    //         if(!member){
    //             color = 16734464;
    //             title = "[!radmin]";
    //             text = `Используйте ${prefix}radmin @user!`;
    //             message.channel.send(infomessage(color, title, text));
    //             return;
    //         }
    //         color = 16734464;
    //         title = `[${prefix}radmin]`;
    //         text = `Пользователь ${member} удалён из админов!`;
    //         message.channel.send(infomessage(color, title, text));
    //         delete perms[member.id]
    //     return;
    // }

    if(commandName == "addmat") {
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}addmat]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        var replace = /\[(.*?)\]/ism;
        var matches = replace.exec(message.content); 
        if(!matches){
            color = 16734464;
            title = `[${prefix}addmat]`;
            text = `Используйте ${prefix}addmat [слово]!`;
            message.channel.send(infomessage(color, title, text));
            return;
        }
        if(badwordslist.indexOf("^"+matches[1]+"$") == -1){
        	badwordslist.push("^"+matches[1]+"$");
        	color = 16711680;
            title = `[${prefix}addmat]`;
            text = `Слово было добавлено в список запрещённых слов!`;
            message.channel.send(infomessage(color, title, text));
        	return;
        }else{
        	color = 16711680;
            title = `[${prefix}addmat]`;
            text = `Это слово уже есть в списке запрещённых слов!`;
            message.channel.send(infomessage(color, title, text));
        	return;
        }
    }
    if(commandName == "unmute"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}unmute]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute){
            color = 16734464;
            title = `[${prefix}unmute]`;
            text = `Используйте ${prefix}unmute @user!`;
            message.channel.send(infomessage(color, title, text));
            return
        }else{
            color = 16734464;
            title = `[${prefix}unmute]`;
            text = `Пользователь убран из мута (${member})!\nУ него ${infobanlist[member.id]} предупреждений(я)! Бан даётся при ${warningcount} предупреждениях!`;
            message.channel.send(infomessage(color, title, text));
            let role = client.guilds.get(serverid).roles.find('name', muterol).id;
            member.removeRole(role);
            delete mutedlist[member.id];
        }
        return;
    }
    
    if(commandName == "muted") {
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        var text = '';
        for (var key in mutedlist) {
            text += `\nПользователь <@${key}> сидит ещё ${ms(mutedlist[key])}`;
        }
        if(text == ""){
            color = 5504768;
            title = `[${prefix}muted]`;
            text = `Пользователей в муте нет!`;
            message.channel.send(infomessage(color, title, text));
        } else {
            color = 5504768;
            title = `[${prefix}muted]`;
            text = `${text}`;
            message.channel.send(infomessage(color, title, text));
        }
        return;
    }
    if(commandName == "github"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        color = 5504768;
        title = `[${prefix}github]`;
        text = `\nМой github - [жми](https://github.com/cheesegaproj/chatbot)`;
        message.channel.send(infomessage(color, title, text));
        return;
    }
    
    if(commandName == "kick"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}kick]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute){
            color = 16711680;
            title = `[${prefix}kick]`;
            text = `Используйте ${prefix}kick @user`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        member.kick()
        .then(() => console.log(`Kicked ${member.displayName}`));
        color = 16734464;
        title = `[${prefix}kick]`;
        text = `${member} кикнут с сервера!`;
        message.channel.send(infomessage(color, title, text));
        return;
    }

    if(commandName == "ban"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}ban]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        let member = message.mentions.members.first();
        let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!tounmute){
            color = 16711680;
            title = `[${prefix}ban]`;
            text = `Используйте ${prefix}ban @user`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        member.ban()
        .then(() => console.log(`Banned ${member.displayName}`));
        color = 16734464;
        title = `[${prefix}ban]`;
        text = `${member} забанен на сервере!\nЕго ID: ${member.id}`;
        message.channel.send(infomessage(color, title, text));
        return;
    }

    if (commandName == "unban") {
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}unban]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        const user = args[0];
        if(!args[0]){
            color = 16711680;
            title = `[${prefix}unban]`;
            text = `Используйте !ban @user`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        message.guild.unban(user);
        console.log(`Unbanned ${user}`);
        color = 16734464;
        title = `[${prefix}unban]`;
        text = `${user} разбанен на сервере!`;
        message.channel.send(infomessage(color, title, text));
        return;  
    }
    if(commandName == "rainbow"){
        member = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}rainbow]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
        // if(args[0] == "start") {
        //     if(interval == undefined) interval = setInterval(() => { discoRole(message); }, 150);
        //     color = 16711867;
        //     title = `[${prefix}rainbow start]`;
        //     text = `Радуга началась!`;
        //     message.channel.send(infomessage(color, title, text));
        //     return;
        // if(args[0] == "stop") {
        //     clearTimeout()
        //     interval = undefined;
        //     color = 24575;
        //     title = `[${prefix}rainbow stop]`;
        //     text = `Радуга останавливается!`;
        //     message.channel.send(infomessage(color, title, text));
        //     return;
        if(args[0] == "user"){
            if(!args[1]){
            	console.log(`${message.author.username}(${message.author.id}) error command rainbow!`);
                color = 16711680;
                title = `[${prefix}rainbow]`;
                text = `Вы не упомянули пользователя!`;
                message.channel.send(infomessage(color, title, text));
                return;
            }else{
                console.log(`in rainbowrole add ${member}`);
                let role = client.guilds.get(serverid).roles.find('name', rainbowroles).id;
                member.addRole(role);
                color = 16729856;
                title = `[${prefix}rainbow]`;
                text = `Радужная роль выдана пользователю ${member}!`;
                message.channel.send(infomessage(color, title, text));
                return;
            }
        } else if(args[0] == "ruser"){
            if(!args[1]){
            	console.log(`${message.author.username}(${message.author.id}) error command rainbow!`)
                color = 16711680;
                title = `[${prefix}rainbow]`;
                text = `Вы не упомянули пользователя!`;
                message.channel.send(infomessage(color, title, text));
                return;
            }else{
                let role = client.guilds.get(serverid).roles.find('name', rainbowroles).id;
                member.removeRole(role);
                console.log(`in rainbowrole remove ${member}`);
                member.addRole(role);
                color = 16729856;
                title = `[${prefix}rainbow]`;
                text = `Радужная роль убрана у пользователя ${member}!`;
                message.channel.send(infomessage(color, title, text));
                return;
            }
        }else {
            color = 16711680;
            title = `[${prefix}rainbow]`;
            text = `Используйте ${prefix}rainbow start или ${prefix}rainbow stop`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        return;
    }
    if(commandName == "coin"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        var rand = Math.floor(Math.random() * (2 - 1 + 1)) + 0;
        if(rand == "0"){
            const embed = new Discord.RichEmbed()
                .setColor(14286592)
                .setFooter("Coder - cheesega. Version: 2.7", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
                .setThumbnail("https://images-ext-1.discordapp.net/external/psw8bjb7MLk5ifrtsyYLtYf_UORozzkQrctGwklKc7U/https/i.imgur.com/ZyCwWuE.png")
                .addField("Coin", "\nВы проиграли")
                message.channel.send(embed);
        }else{
            const embed = new Discord.RichEmbed()
                .setColor(14286592)
                .setFooter("Coder - cheesega. Version: 2.7", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
                .setThumbnail("https://images-ext-1.discordapp.net/external/0Aqs6FQriCBitmkZqMNBhedGhVM-J8wDVPnHQhFhdgQ/https/i.imgur.com/9FsWNZk.png")
                .addField("Coin", "\nВы выиграли")
            message.channel.send(embed);
        }
        return
    }

    if(commandName == "report"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        let user = message.guild.member(message.mentions.users.first());
        if(!user){
            color = 16711680;
            title = `[${prefix}report]`;
            text = `Вы не упомянули пользователя и не написали причину !report @user [reason]`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        var replace = /\[(.*?)\]/ism;
        var reportuser = replace.exec(message.content);
        if(!reportuser){
            color = 16711680;
            title = `[${prefix}report]`;
            text = `Вы не написали причину !report @user [reason]`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        channel = message.guild.channels.find('name', reportchannel);
        const embed = new Discord.RichEmbed()
            .setColor(13632027)
            .setFooter("Coder - cheesega. Version: 2.7", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
            .addField("Нарушитель", `<@${user.id}>`)
            .addField("Канал", `${message.channel}`)
            .addField("Отправитель", `<@${message.author.id}>`)
            .addField("Текст репорта", `**${reportuser[1]}**\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
            channel.send(embed);
            message.reply("ваша жалоба на пользователя отправлена! Ваше сообщение с командой !report было удалено.");
            message.delete(message.author.id);
        return;
    }
    if(commandName == "weather"){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(!args[0]){
            color = 16711680;
            title = `[${prefix}weather]`;
            text = `Укажите город! ${prefix}weather Город`;
            message.channel.send(infomessage(color, title, text));
            return
        }
        weather.find({search: args[0], degreeType: 'C'}, function(err, result) { //degreeType - тип градуса(С - цельсий, F - фаренгейт)
        if(err) console.log(err);
        if(!result[0]){
            color = 16711680;
            title = `[${prefix}weather]`;
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
            .setFooter("Coder - cheesega. Version: 2.7", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png");
            message.channel.send(weather);
        });
        return;
    }

    if(commandName == "admins"){
    	console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
    	color = 16777215;
    	title = `[${prefix}admins]`;
        text =  `**Список пользователей, которые добавлены в администраторы бота:**\n`;
		perms['root'].forEach(function(item, i, arr) {
  			text += (`\n<@${item}>`);
		});
		message.channel.send(infomessage(color, title, text));
    	return;
	}
	if(commandName == "restart"){
		console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
		if(perms['root'].indexOf(message.author.id) == -1){
            color = 16711680;
            title = `[${prefix}restart]`;
            text = `У тебя нет прав для выполнения данной команды!`;
            message.channel.send(infomessage(color, title, text));
            console.log(`WARNING! ${message.author.username} does not have permission to execute this command!`);
            return;
        }
	message.delete()
            .then(message => client.destroy())
            .then(() => client.login(token))
            .then(() => console.log("Restarting the bot..."));
        color = 16711680;
    	title = `[${prefix}restart]`;
    	text = `**Внимание!** Перезагрузка бота!`;
    	message.channel.send(infomessage(color, title, text));
        return;
    }
	if(commandName == 'play'){
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(lvls[message.author.id]<fourlvl) return message.reply("у вас слишком маленький лвл!");
        let suffix = message.content.split(" ").slice(1).join(" ");
        if (!suffix) return message.channel.send(`Пожалуйста используйте ${prefix}play название трека/ссылка`);
        if (!client.voiceConnections.get(message.author.id)) {
          if (message.channel.type !== 'text'){
          	color = 16711680;
            title = `[${prefix}rainbow]`;
            text = `Ты не в голосовом канале`;
            message.channel.send(infomessage(color, title, text));
            return;
          }
          const { voiceChannel } = message.member;
          if (!voiceChannel){
          	color = 16711680;
            title = `[${prefix}rainbow]`;
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
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(lvls[message.author.id]<fourlvl) return message.reply("у вас слишком маленький лвл!");
        const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${prefix}rainbow]`;
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
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(lvls[message.author.id]<fourlvl) return message.reply("у вас слишком маленький лвл!");
        const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${prefix}rainbow]`;
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
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(lvls[message.author.id]<fourlvl) return message.reply("у вас слишком маленький лвл!");
        const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${prefix}rainbow]`;
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
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(lvls[message.author.id]<fourlvl) return message.reply("у вас слишком маленький лвл!");
        const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${prefix}rainbow]`;
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
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
    	color = 6143311;
        title = "MusicSound";
        text = "";
        var queue = getQueue(serverid);
        queue.forEach(function(element, index, array){
            text += '\n'+"`"+(index+1)+'.` `'+Math.floor(element.seconds/60)+':'+element.seconds%60+'`'+' '+`${element.title}`;
            //[${element.title}](https://www.youtube.com/watch?v=${element.id})
        })
        const embed = new Discord.RichEmbed()
            .setColor(16734464)
            .setAuthor(title)
            .setFooter("Coder - cheesega. Version: 2.7", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
            .setDescription(`${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        message.channel.send(embed);
        return
    }
    if(commandName == "remove") {
        console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot!`);
        if(lvls[message.author.id]<fourlvl) return message.reply("у вас слишком маленький лвл!");
        const { voiceChannel } = message.member;
        if (!voiceChannel){
            color = 16711680;
          title = `[${prefix}rainbow]`;
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
    console.log(`${message.author.username}(${message.author.id}) send command ${commandName} for bot! This command off in bot or undefined`);
    color = 16711680;
    title = `[Error]`;
    text = `Эта комнанда не найдена! Напишите ${prefix}info чтобы узнать список команд`;
    message.channel.send(infomessage(color, title, text));
});

function removeMusic(msg, args) {
    g = parseInt(args[0] - 1);
    queue = getQueue(serverid);
    if(queue[g] == undefined) return false;
    fs.unlinkSync('./music/'+queue[g].toplay)
    queue.splice(g, 1);
    return true;
}

async function purge(message, args) {
    if(!args[0]){
        color = 16711680;
        title = `[${prefix}clean]`;
        text = `Введи число сообщений, которое хочешь удалить (0-100) ${prefix}clear 100`;
        message.channel.send(infomessage(color, title, text));
        return
    }
    const fetched = await message.channel.fetchMessages({limit: args[0]});
    var messages = [];
    fetched.forEach(function(element, index, array) {
        if(element.author.id == client.user.id || element.content.startsWith(prefix)) messages.push(element);
    });
    messages.forEach(function(element, index, array) {
        message.channel.fetchMessage(element.id)
            .then(message => message.delete())
    });
}

function infomessage(color, title, text) {
        const embed = new Discord.RichEmbed()
            .setColor(color)
            .setFooter("Coder - cheesega. Version: 2.7", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
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
            .setFooter("Coder - cheesega. Version: 2.7", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
            .addField(`[${prefix}mute]`, `Используйте ${prefix}mute @user 1s/m/h/d points!\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
        message.channel.send(embed);
        return
    }
    let mutetime = args[1];
    if(!mutetime){
        const embed = new Discord.RichEmbed()
            .setColor(16734464)
            .setFooter("Coder - cheesega. Version: 2.7", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")        
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
    let role = client.guilds.get(serverid).roles.find('name', muterol).id;
    if(!auto) { mod = message.author.id; } else { mod = client.user.id; }
    tomute.addRole(role).then(function() {
        let user = client.guilds.get(serverid).members.get(tomute.id).user;
        const embed = new Discord.RichEmbed()
            .setColor(13632027)
            .setFooter("Coder - cheesega. Version: 2.7", "https://cdn.discordapp.com/avatars/247102468331274240/b1a24fab7dfdad1ce8032b19c22940c5.png")
            .addField("User", `<@${tomute.id}>`, true)
            .addField("Moderator", `<@${mod}>`, true)
            .addField("Reason", `${reason}`, true)
            .addField("Duration", `${mutetime}`, true)
            message.channel.send(embed);
        if(ms(mutetime) != 0) mutedlist[tomute.id] = ms(mutetime);
        mutedlist[tomute.id] = ms(mutetime);
        if(warningcountonoff == 'on'){
            if(!infobanlist[tomute.id]) infobanlist[tomute.id] = 0;
            infobanlist[tomute.id] += 1;
            lvls[tomute.id] -=5000;
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
                data = [message.author.id, automutetime, 'Нецензурные выражения'];
                Mute(message, data, true);
                message.delete(5000);
                return;
            }
        }
    }
}

function UnMute(channel, id) {
    console.log(`Update badwordslist remove`);
    if(!IsAuth) return false;
    let role = client.guilds.get(channel).roles.find('name', muterol).id;
    member = client.guilds.get(channel).members.get(id);
    try {
        client.guilds.get(channel).members.get(id).removeRole(role);
    } catch(err) {
        return false;
    }
    if(infobanlist[member.id] == warningcount){
        member.ban();
        color = 16734464;
        title = `[${prefix}unmute]`;
        text = `${member} забанен на сервере!\nЕго ID: ${member.id}`;
        var channel = client.guilds.get(channel).channels.find('id', generalchatid);
        channel.send(infomessage(color, title, text));
        delete infobanlist[member.id];
        return true;
    }
    color = 16734464;
    title = `[${prefix}unmute]`;
    text = `Пользователь убран из мута(<@${id}>)!\nУ него ${infobanlist[id]} предупреждений(я)! Бан даётся при ${warningcount} предупреждениях!`;
    var channel = client.guilds.get(channel).channels.find('id', generalchatid);
    channel.send(infomessage(color, title, text));
    return true;
}

function minusMutedList() {
    for (var key in mutedlist) {
        if(mutedlist[key] <= 1) { 
            mutedlist[key] = mutedlist[key] - 1;
            if(UnMute(serverid, key)) delete mutedlist[key];
        } else {
            mutedlist[key] = mutedlist[key] - 1;
        }
    }
}

setInterval(minusMutedList, 1);

function saveMutedList() {
    fs.writeFile('muted.json', JSON.stringify(mutedlist), function() {/*console.log(whitelist);*/});
}
setInterval(saveMutedList, 1000);
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