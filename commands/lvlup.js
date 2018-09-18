const fs = require('fs');
var lvls = JSON.parse(fs.readFileSync('./lvls.json'));
const config = require('../config.js');
module.exports = {
    name: 'lvlup',
    execute(message) {
        if(!lvls[message.author.id]) lvls[message.author.id]=0;
        lvls[message.author.id]+=config.lvlplus;
        fs.writeFile('lvls.json', JSON.stringify(lvls), function() {/*console.log(whitelist);*/});
    }
}