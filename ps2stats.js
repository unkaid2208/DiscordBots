//Planetside 2 Character Stats
//http://wiki.planetside-universe.com/ps/API/Collections
//http://census.daybreakgames.com/#url-pattern
//http://census.daybreakgames.com/get/ps2/single_character_by_id/?id=5428587263540028225
//https://discordapp.com/oauth2/authorize?client_id=338958458772520960&scope=bot&permissions=3072

const Discord = require('discord.js');
const getJSON = require('get-json');
const bot = new Discord.Client();
const prefex = '.'

bot.on('error', console.error)
    .on('debug', console.log)
    .on('ready', function() {
    console.log('Bot is online!');
    bot.user.setGame('.ps2 InGameName');
    });

bot.on('message', function(message) {
		if (!message.content.startsWith(prefex)) return;

    var args = message.content.substring(prefex.length).split(' ');

    switch (args[0].toLocaleLowerCase()) {
        case "ps2":
            if (args[1]) {
                var charIdURL = 'http://census.daybreakgames.com/get/ps2:v2/character/?name.first_lower='+args[1].toLocaleLowerCase()+'&c:show=character_id';//&callback=?';
                getJSON(charIdURL, function (error,response) {
                    var charId = response.character_list;
                    //console.log(charId[0].character_id);
                    if (charId[0] == undefined) {
                        message.channel.send({embed: {
                            color: 3447003,
                            fields: [{
                                name: 'Oops!',
                                value: 'Player not found'
                            }]
                        }     
                    });
                    return;
                    }
                    //});
                   /* for (i=0; i < charId[0].stats.weapon_stat_by_faction.length; i++) {
                        if (charId[0].stats.weapon_stat_by_faction[i].stat_name == 'weapon_headshots') {
                            var allHeadshots = parseInt(charId[0].stats.weapon_stat_by_faction[i].value_nc)+parseInt(charId[0].stats.weapon_stat_by_faction[i].value_tr)+parseInt(charId[0].stats.weapon_stat_by_faction[i].value_vs);
                        }
                        if (charId[0].stats.weapon_stat_by_faction[i].stat_name == 'weapon_kills') {
                            var allWeapKills = parseInt(charId[0].stats.weapon_stat_by_faction[i].value_nc)+parseInt(charId[0].stats.weapon_stat_by_faction[i].value_tr)+parseInt(charId[0].stats.weapon_stat_by_faction[i].value_vs);
                            }
                        if (charId[0].stats.weapon_stat_by_faction[i].stat_name == 'weapon_vehicle_kills') {
                            var allVehKills = parseInt(charId[0].stats.weapon_stat_by_faction[i].value_nc)+parseInt(charId[0].stats.weapon_stat_by_faction[i].value_tr)+parseInt(charId[0].stats.weapon_stat_by_faction[i].value_vs);
                            }
                    } */
                   // var charInfoURL = 'http://census.daybreakgames.com/get/ps2:v2/single_character_by_id/?id='+charId[0].character_id;
                    var charInfoURL = 'http://census.daybreakgames.com/get/ps2:v2/single_character_by_id/?id='+charId[0].character_id;
                    getJSON(charInfoURL, function (error,response) {
                        var charInfo = response.single_character_by_id_list;
                        var allKills = charInfo[0].stats.stat_history.kills.all_time;
                        var allDeaths = charInfo[0].stats.stat_history.deaths.all_time;                        
                        kdRatio = allKills/allDeaths

                        //1 - vs
                        //2 - nc 
                        //3 - tr
                        message.channel.send({embed: {
                            color: 3447003,
                            fields: [{
                                    name: 'Name: ',
                                    value: charInfo[0].name.first
                                } , {
                                    name: 'BR: ',
                                    value: charInfo[0].battle_rank.value
                                } , {
                                    name: 'KDR: ',
                                    value: kdRatio.toFixed(3)
                                }
                            ],
                            footer: {
                                    text: '© XeNONE#9710'
                                }
                            }
                        });
                    });
                });
            }                        
        break;
        default:
            return;
    }
});

bot.login('YOUR_KEY_HERE');
