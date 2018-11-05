const Discord = require('discord.js');
module.exports = {
    name: 'coin',
    execute(message, args) {
        message.delete(5000);      
        var rand = Math.floor(Math.random() * (2 - 1 + 1)) + 0;
        if(rand == "0"){
            const embed = new Discord.RichEmbed()
                .setColor(14286592)
                .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
                .setThumbnail("https://images-ext-1.discordapp.net/external/psw8bjb7MLk5ifrtsyYLtYf_UORozzkQrctGwklKc7U/https/i.imgur.com/ZyCwWuE.png")
                .addField("Coin", "\nВы проиграли.")
                message.channel.send(embed).then(msg => msg.delete(5000));
        }
        if(rand == '1'){
            const embed = new Discord.RichEmbed()
                .setColor(14286592)
                .setFooter("Coder - cheesega. ", "https://media.discordapp.net/attachments/275709588496580608/485043932523134976/2.jpg")
                .setThumbnail("https://images-ext-1.discordapp.net/external/0Aqs6FQriCBitmkZqMNBhedGhVM-J8wDVPnHQhFhdgQ/https/i.imgur.com/9FsWNZk.png")
                .addField("Coin", "\nВы выиграли. Начисляем вам 50 опыта!")
            message.channel.send(embed).then(msg => msg.delete(5000));
        }
    }
}