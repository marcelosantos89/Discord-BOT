const Discord = require('discord.js');
const axios = require('axios')

module.exports = {
  name: 'reddit',
  description: 'Display Top Reddit Post.',
  execute(message, args) {
    var url = ''

    if(args.length > 0) {
      if(args[0] === 'best' || args[0] === 'hot') {
        url = "https://reddit.com/"+args[0]+"/.json?limit=1"
      } else {
        url = "https://reddit.com/r/"+args[0]+"/.json?limit=1"
      }
    } else {
      url = "https://reddit.com/.json?limit=1"
    }

    axios.get(url)
      .then(response => {

        var redditPost = response.data.data.children;
        const exampleEmbed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle(redditPost[0].data.title)
          .setURL(redditPost[0].data.url)
          .setDescription('Subreddit: ' + redditPost[0].data.subreddit_name_prefixed)
          .setThumbnail('https://logosmarcas.net/wp-content/uploads/2020/11/Reddit-Logo-650x366.png')
          .setTimestamp(redditPost[0].data.created_utc)

        message.channel.send(exampleEmbed);
      })
      .catch(error => {
        
      })

  },
};