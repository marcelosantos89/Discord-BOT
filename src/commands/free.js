const https = require('https');
const xml2js = require('xml2js');
const Discord = require('discord.js');
const cheerio = require("cheerio");

module.exports = {
  name: 'free',
  description: 'Get Latest Free Game',
  execute(message) {
    var parser = new xml2js.Parser();
    https.get('https://steamcommunity.com/groups/freegamesfinders/rss', (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        parser.parseString(data, function (err, result) {
          let content = result.rss.channel[0].item[0];
          const links = new Array();
          const $ = cheerio.load(content.description[0]);

          // Get a resume from description
          var stripedHtml = content.description[0].split('<br>');

          // Process the Game Link it will most likely be the first link on the description
          $('a').each(function() {
            links.push($(this).attr('href'));
          });

          var gameLink = '';
          if(links.length > 0){
            gameLink = links[0].replace('https://steamcommunity.com/linkfilter/?url=', '');
          }

          // Process the Title
          var title = content.title[0].replace('free from', '-')

          // Generate Message Embed for Discord
          const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(title)
            .setURL(gameLink)
            .setDescription(stripedHtml[0])
            .setTimestamp()
          
          message.channel.send(exampleEmbed);
        });
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });

  },
};