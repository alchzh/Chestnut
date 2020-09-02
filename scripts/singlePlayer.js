const fs = require('fs');
const Discord = require('discord.js');
const dice = require('dice-coefficient');
const replace = require('./replace');
const wikipedia = require('./wikipedia');

function firstPart(message, prefix, userData, selectedQuestions) {
    let n = Math.floor((Math.random() * selectedQuestions.bonuses.length));
    replace.strings(n, selectedQuestions);
    wikipedia.search(selectedQuestions.bonuses[n].answers[0], message.author, userData);
    let firstEmbed = new Discord.MessageEmbed()
        .setColor('#f5f5f5')
        .setAuthor(selectedQuestions.bonuses[n].tournament.name + ' | ' + selectedQuestions.bonuses[n].category.name)
        .setTitle('Bonus One')
        .setDescription(selectedQuestions.bonuses[n].formatted_leadin + ' ' +
            selectedQuestions.bonuses[n].formatted_texts[0])
        .setFooter(userData[message.author.id].points + ' points in ' + userData[message.author.id].parts + ' bonus parts');
    message.channel.send(firstEmbed);
    let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
    collector.on('collect', message => {
        let collectorArgs = message.content.split(/ +/);
        if (message.content == prefix + 'end') {
            collector.stop();
        } else if (message.content == prefix + 'skip') {
            collector.stop();
            firstPart(selectedQuestions);
        } else if (userData[message.author.id].playing === 'no') {
            collector.stop();
        } else if (message.content == prefix + 'pause') {
            userData[message.author.id].paused = 'yes';
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (message.content == prefix + 'play') {
            userData[message.author.id].paused = 'no'
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (userData[message.author.id].paused === 'no') {
            if (dice(message.content.toLowerCase(), selectedQuestions.bonuses[n].answers[0].toLowerCase()) > 0.4) {
                var correctEmbed = new Discord.MessageEmbed()
                    .setColor('#53d645')
                    .setTitle('🟢 Correct')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[0] + '](' + userData[message.author.id].link + ') \n\nReact ✅ or ❌ to override the decision This can only be done once')
                userData[message.author.id].points += 10;
                message.channel.send(correctEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter);
                    reactionCollector.on('collect', (reaction, user) => {
                        if (reaction.emoji.name === '❌') {
                            userData[message.author.id].points -= 10;
                            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                        }
                        reactionCollector.stop();
                    });
                });
            } else {
                var incorrectEmbed = new Discord.MessageEmbed()
                    .setColor('#f72843')
                    .setTitle('🔴 Incorrect')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[0] + '](' + userData[message.author.id].link + ') \n\nReact ✅ or ❌ to override the decision This can only be done once')
                message.channel.send(incorrectEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter);
                    reactionCollector.on('collect', (reaction, user) => {
                        if (reaction.emoji.name === '✅') {
                            userData[message.author.id].points += 10;
                            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                        }
                        reactionCollector.stop();
                    });
                });
            }
            userData[message.author.id].parts++
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            secondPart(message, prefix, userData, n, selectedQuestions);
            collector.stop()
        }
    });
}

function secondPart(message, prefix, userData, n, selectedQuestions) {
    wikipedia.search(selectedQuestions.bonuses[n].answers[1], message.author, userData);
    let secondEmbed = new Discord.MessageEmbed()
        .setColor('#f5f5f5')
        .setAuthor(selectedQuestions.bonuses[n].tournament.name + ' | ' + selectedQuestions.bonuses[n].category.name)
        .setTitle('Bonus Two')
        .setDescription(selectedQuestions.bonuses[n].formatted_texts[1])
        .setFooter(userData[message.author.id].points + ' points in ' + userData[message.author.id].parts + ' bonus parts');
    message.channel.send(secondEmbed);

    let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
    collector.on('collect', message => {
        let collectorArgs = message.content.split(/ +/);
        if (message.content == prefix + 'end') {
            collector.stop();
        } else if (message.content == prefix + 'skip') {
            collector.stop();
            firstPart(selectedQuestions);
        } else if (userData[message.author.id].playing === 'no') {
            collector.stop();
        } else if (message.content == prefix + 'pause') {
            userData[message.author.id].paused = 'yes';
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (message.content == prefix + 'play') {
            userData[message.author.id].paused = 'no'
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (userData[message.author.id].paused === 'no') {
            if (dice(message.content.toLowerCase(), selectedQuestions.bonuses[n].answers[1].toLowerCase()) > 0.4) {
                var correctEmbed = new Discord.MessageEmbed()
                    .setColor('#53d645')
                    .setTitle('🟢 Correct')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[1] + '](' + userData[message.author.id].link + ') \n\nReact ✅ or ❌ to override the decision This can only be done once')
                userData[message.author.id].points += 10;
                message.channel.send(correctEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter);
                    reactionCollector.on('collect', (reaction, user) => {
                        if (reaction.emoji.name === '❌') {
                            userData[message.author.id].points -= 10;
                            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                        }
                        reactionCollector.stop();
                    });
                });

            } else {
                var incorrectEmbed = new Discord.MessageEmbed()
                    .setColor('#f72843')
                    .setTitle('🔴 Incorrect')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[1] + '](' + userData[message.author.id].link + ') \n\nReact ✅ or ❌ to override the decision This can only be done once')
                message.channel.send(incorrectEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter);
                    reactionCollector.on('collect', (reaction, user) => {
                        if (reaction.emoji.name === '✅') {
                            userData[message.author.id].points += 10;
                            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                        }
                        reactionCollector.stop();
                    });
                });
            }
            userData[message.author.id].parts++
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            thirdPart(message, prefix, userData, n, selectedQuestions);
            collector.stop()
        }
    });
}

function thirdPart(message, prefix, userData, n, selectedQuestions) {
    wikipedia.search(selectedQuestions.bonuses[n].answers[2], message.author, userData);
    let thirdEmbed = new Discord.MessageEmbed()
        .setColor('#f5f5f5')
        .setAuthor(selectedQuestions.bonuses[n].tournament.name + ' | ' + selectedQuestions.bonuses[n].category.name)
        .setTitle('Bonus Three')
        .setDescription(selectedQuestions.bonuses[n].formatted_texts[2])
        .setFooter(userData[message.author.id].points + ' points in ' + userData[message.author.id].parts + ' bonus parts');
    message.channel.send(thirdEmbed);
    let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id);
    collector.on('collect', message => {
        let collectorArgs = message.content.split(/ +/);
        if (message.content == prefix + 'end') {
            collector.stop();
        } else if (message.content == prefix + 'skip') {
            collector.stop();
            firstPart(selectedQuestions);
        } else if (userData[message.author.id].playing === 'no') {
            collector.stop();
        } else if (message.content == prefix + 'pause') {
            userData[message.author.id].paused = 'yes';
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (message.content == prefix + 'play') {
            userData[message.author.id].paused = 'no'
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
        } else if (userData[message.author.id].paused === 'no') {

            if (dice(message.content.toLowerCase(), selectedQuestions.bonuses[n].answers[2].toLowerCase()) > 0.4) {
                var correctEmbed = new Discord.MessageEmbed()
                    .setColor('#53d645')
                    .setTitle('🟢 Correct')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[2] + '](' + userData[message.author.id].link + ') \n\nReact ✅ or ❌ to override the decision This can only be done once')
                userData[message.author.id].points += 10;
                message.channel.send(correctEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter);
                    reactionCollector.on('collect', (reaction, user) => {
                        if (reaction.emoji.name === '❌') {
                            userData[message.author.id].points -= 10;
                            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                        }
                        reactionCollector.stop();
                    });
                });
            } else {
                var incorrectEmbed = new Discord.MessageEmbed()
                    .setColor('#f72843')
                    .setTitle('🔴 Incorrect')
                    .setDescription('[' + selectedQuestions.bonuses[n].formatted_answers[2] + '](' + userData[message.author.id].link + ') \n\nReact ✅ or ❌ to override the decision This can only be done once')
                message.channel.send(incorrectEmbed).then(embedMessage => {
                    embedMessage.react('✅');
                    embedMessage.react('❌');
                    let filter = (reaction, user) => {
                        return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
                    };
                    let reactionCollector = embedMessage.createReactionCollector(filter);
                    reactionCollector.on('collect', (reaction, user) => {
                        if (reaction.emoji.name === '✅') {
                            userData[message.author.id].points += 10;
                            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
                        }
                        reactionCollector.stop();
                    });
                });
            }
            userData[message.author.id].parts++
            fs.writeFileSync('./data/users.json', JSON.stringify(userData));
            firstPart(message, prefix, userData, selectedQuestions);
            collector.stop()
        }
    });
}

module.exports = { firstPart }