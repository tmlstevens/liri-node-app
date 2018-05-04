require("dotenv").config();
var myKeys = require('./keys')
var request = require('request');
var Twitter = require('twitter');
var client = new Twitter(myKeys.twitter);
var Spotify = require('node-spotify-api');
var spotify = new Spotify(myKeys.spotify);
var inquirer = require('inquirer');


var liriCommand1 = process.argv[2];
// var titleLength = process.argv.length - 3;
var myTitle = process.argv.slice(3).join(' ');
// console.log('myTitle: ' + myTitle);
var defaultTitle = 'Ace of Base';

switch (liriCommand1) {
    case "my-tweets":
      myTweets();
      break;
    case "spotify-this-song":
      mySong();
      break;
};

function myTweets() {
    client.get('https://api.twitter.com/1.1/search/tweets.json', {
        from:'easyt4321',
        count: '20'
    },
    function(error, tweets, response) {
            if(error) throw error;
            var mytweets = tweets;
            console.log('Awesome tweets from EasyT:');
            for (var i = 0; i < tweets.statuses.length; i++) {
                console.log('"' + tweets.statuses[i].text + '", ' + tweets.statuses[i].created_at.slice(4,16))
            }
    })
};

function mySong() {
    if (myTitle) {
        var title = myTitle;
    } else {
        var title = defaultTitle;
    }
    spotify.search({type: 'track', query: title, limit: '1'})
    .then(function(response) {
        console.log('Song: ' + response.tracks.items[0].name + '\nArtist: ' + response.tracks.items[0].artists[0].name + '\nAlbum: ' + response.tracks.items[0].album.name + '\nPreview: ' + response.tracks.items[0].preview_url + '\nFull Song: ' + response.tracks.items[0].external_urls.spotify);
    })
    .catch(function(err) {
        console.log(err)
    })
}




// debugger;
// console.log(tweets.statuses)
// console.log(JSON.stringify({response}, null, 4))
//JSON.stringify(response), null, //'4'