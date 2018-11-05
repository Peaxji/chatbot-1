const language = require('../language.json');
const cnf = require('../config.js');
const Discord = require('discord.js');
module.exports = {
    name: 'info',
    execute(message, args) {
            if(!args.length) {
               text = `${language.oneinfo} **${cnf.prefix}info 1**):\n**1. ${cnf.prefix}mute\n2. ${cnf.prefix}addmat\n3. ${cnf.prefix}unmute\n4. ${cnf.prefix}muted\n5. ${cnf.prefix}github\n6. ${cnf.prefix}kick\n7. ${cnf.prefix}ban\n8. ${cnf.prefix}unban\n9. ${cnf.prefix}rainbow\n10. ${cnf.prefix}coin\n11. ${cnf.prefix}exit\n12. ${cnf.prefix}report\n13.${cnf.prefix}warnings\n14. ${cnf.prefix}rwarnings\n15. ${cnf.prefix}weather**`;
               const embed = new Discord.RichEmbed()
                .setAuthor(`[${cnf.prefix}info]`)
                .setColor(16777215)
                .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
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
                            embed.setDescription(`${language.oneinfo} **${cnf.prefix}info 1**):\n**1. ${cnf.prefix}mute\n2. ${cnf.prefix}addword\n3. ${cnf.prefix}unmute\n4. ${cnf.prefix}muted\n5. ${cnf.prefix}github\n6. ${cnf.prefix}kick\n7. ${cnf.prefix}ban\n8. ${cnf.prefix}unban\n9. ${cnf.prefix}rainbow\n10. ${cnf.prefix}coin\n11. ${cnf.prefix}exit\n12. ${cnf.prefix}report\n13.${cnf.prefix}warnings\n14. ${cnf.prefix}rwarnings\n15. ${cnf.prefix}weather**\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`);
                            msg.edit(embed)
                        })
                        
                        forwards.on('collect', r => {
                            embed.setDescription(`${language.oneinfo} **${cnf.prefix}info 1**):\n**16. ${cnf.prefix}clear\n17. ${cnf.prefix}clean\n18. ${cnf.prefix}admins\n19. ${cnf.prefix}restart\n20. ${cnf.prefix}play\n21. ${cnf.prefix}pause\n22. ${cnf.prefix}resume\n23. ${cnf.prefix}skip\n24 ${cnf.prefix}volume\n25. ${cnf.prefix}remove\n26. ${cnf.prefix}queue\n27. ${cnf.prefix}sendlog\n28. ${cnf.prefix}say**\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`);
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
                title = `[${cnf.prefix}info 1]`;
                text = language.info1.replace('{0}', cnf.prefix);
                message.channel.send(infomessage(color, title, text));         
                
                return;
            }
            if(args[0] == "2"){
                color = 16777215;
                title = `[${cnf.prefix}info 2]`;
                text = language.info2.replace('{0}', cnf.prefix);     
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "3"){
                color = 16777215;
                title = `[${cnf.prefix}info 3]`;
                text = language.info3.replace('{0}', cnf.prefix);
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "4"){
                color = 16777215;
                title = `[${cnf.prefix}info 4]`;
                text = language.info4.replace('{0}', cnf.prefix);
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "5"){
                color = 16777215;
                title = `[${cnf.prefix}info 5]`;
                text = language.info5.replace('{0}', cnf.prefix);
                message.channel.send(infomessage(color, title, text));
                
                return;
            }
            if(args[0] == "6"){
                color = 16777215;
                title = `[${cnf.prefix}info 6]`;
                text = language.info6.replace('{0}', cnf.prefix);      
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "7"){
                color = 16777215;
                title = `[${cnf.prefix}info 7]`;
                text = language.info7.replace('{0}', cnf.prefix);       
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "8"){
                color = 16777215;
                title = `[${cnf.prefix}info 8]`;
                text = language.info8.replace('{0}', cnf.prefix);      
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "9"){
                color = 16777215;
                title = `[${cnf.prefix}info 9]`;
                text = language.info9.replace('{0}', cnf.prefix);
                text = text.replace('{0}', cnf.prefix);  
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "10"){
                color = 16777215;
                title = `[${cnf.prefix}info 10]`;
                text = language.info10.replace('{0}', cnf.prefix);     
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "11"){
                color = 16777215;
                title = `[${cnf.prefix}info 11]`;
                text = language.info11.replace('{0}', cnf.prefix);     
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "12"){
                color = 16777215;
                title = `[${cnf.prefix}info 12]`;
                text = language.info12.replace('{0}', cnf.prefix);
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "13"){
                color = 16777215;
                title = `[${cnf.prefix}info 13]`;
                text = language.info13.replace(/%/g, cnf.prefix);       
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "14"){
                color = 16777215;
                title = `[${cnf.prefix}info 14]`;
                text = language.info14.replace(/%/g, cnf.prefix);      
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "15"){
                color = 16777215;
                title = `[${cnf.prefix}info 15]`;
                text = language.info15.replace('{0}', cnf.prefix);       
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "16"){
                color = 16777215;
                title = `[${cnf.prefix}info 16]`;
                text = language.info16.replace('{0}', cnf.prefix);
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "17"){
                color = 16777215;
                title = `[${cnf.prefix}info 17]`;
                text = language.info17.replace('{0}', cnf.prefix);
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "18"){
                color = 16777215;
                title = `[${cnf.prefix}info 18]`;
                text = language.info18.replace('{0}', cnf.prefix);
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "19"){
                color = 16777215;
                title = `[${cnf.prefix}info 19]`;
                text = language.info19.replace('{0}', cnf.prefix);
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "20"){
                color = 16777215;
                title = `[${cnf.prefix}info 20]`;
                text = language.info20.replace('{0}', cnf.prefix);
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "21"){
                color = 16777215;
                title = `[${cnf.prefix}info 21]`;
                text = language.info21.replace('{0}', cnf.prefix);
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "22"){
                color = 16777215;
                title = `[${cnf.prefix}info 22]`;
                text = language.info22.replace('{0}', cnf.prefix);
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "23"){
                color = 16777215;
                title = `[${cnf.prefix}info 23]`;
                text = language.info23.replace('{0}', cnf.prefix);
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "24"){
                color = 16777215;
                title = `[${cnf.prefix}info 24]`;
                text = language.info24.replace('{0}', cnf.prefix);
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "25"){
                color = 16777215;
                title = `[${cnf.prefix}info 25]`;
                text = language.info25.replace('{0}', cnf.prefix);
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "26"){
                color = 16777215;
                title = `[${cnf.prefix}info 26]`;
                text = language.info26.replace('{0}', cnf.prefix);
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "30"){
                color = 16777215;
                title = `[${cnf.prefix}info 30]`;
                text = language.info30.replace('{0}', cnf.prefix);
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
            if(args[0] == "31"){
                color = 16777215;
                title = `[${cnf.prefix}info 31]`;
                text = language.info31.replace('{0}', cnf.prefix);
                
                message.channel.send(infomessage(color, title, text));
                return;
            }
    }
};
function infomessage(color, title, text) {
    const embed = new Discord.RichEmbed()
        .setColor(color)
        .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
        .addField(title, `${text}\n\n[Сервер поддержки](https://discord.gg/jwnPHdA)`)
    return embed;
}   