require("dotenv").config();
var fs = require('fs');
var myKeys = require('./keys')
var request = require('request');
var Twitter = require('twitter');
var client = new Twitter(myKeys.twitter);
var Spotify = require('node-spotify-api');
var spotify = new Spotify(myKeys.spotify);

var liriCommand;
var myTitle;
argvHandler();

function argvHandler() {
    liriCommand = process.argv[2];
    if (process.argv[3]) {
        myTitle = process.argv.slice(3).join(' ');
    } else {
        if (liriCommand === 'spotify-this-song') {
            myTitle = 'The Sign, Ace of Base';
        } else if (liriCommand === 'movie-this') {
            myTitle = 'Mr. Nobody';
        } 
    };
    switch (liriCommand) {
        case "my-tweets":
            myTweets();
            break;
        case "spotify-this-song":
            mySong();
            break;
        case 'movie-this':
            myMovie();
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
    }
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
    spotify.search({type: 'track', query: myTitle, limit: '2'})
    .then(function(response) {
        console.log('Song: ' + response.tracks.items[0].name + '\nArtist: ' + response.tracks.items[0].artists[0].name + '\nAlbum: ' + response.tracks.items[0].album.name + '\nPreview: ' + response.tracks.items[0].preview_url + '\nFull Song: ' + response.tracks.items[0].external_urls.spotify);
    })
    .catch(function(err) {
        console.log(err)
    })
};

function myMovie() {
    var baseUrl = 'http://www.omdbapi.com/?';
    var omdbKey = 'apikey=trilogy';
    var queryUrl = baseUrl + omdbKey + '&t=' + myTitle;
    request(queryUrl, function (error, response, body) {
        console.log(queryUrl);
        if (error) {
            console.log(error);
            console.log('statusCode:', response && response.statusCode);
        }
        else {  // Handled a movie that does not have rotten tomatoes rating
            var myObject = JSON.parse(body);
            if (myObject.Ratings && myObject.Ratings[1] && myObject.Ratings[1].Source === 'Rotten Tomatoes') {
                var rottenTomatoes = myObject.Ratings[1].Value;
                console.log('Title: ' + myObject.Title + '\nYear: ' + myObject.Year + '\nIMDB Rating: ' + myObject.imdbRating + '\nRotten Tomatoes Rating: ' + rottenTomatoes + '\nCountry: ' + myObject.Country + '\nLanguage: ' + myObject.Language + '\nPlot: ' + myObject.Plot + '\nActors: ' + myObject.Actors);
            } 
            else {
                console.log('Title: ' + myObject.Title + '\nYear: ' + myObject.Year + '\nIMDB Rating: ' + myObject.imdbRating + '\nCountry: ' + myObject.Country + '\nLanguage: ' + myObject.Language + '\nPlot: ' + myObject.Plot + '\nActors: ' + myObject.Actors);
            }
        }
    })
};

function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            return console.log(error);
        }
        var array = data.split(',');
        var liriCommand = array[0];
        var myTitle = array[1].slice(1,-1);

        spotify.search({type: 'track', query: myTitle, limit: '2'})
        .then(function(response) {
            console.log('Song: ' + response.tracks.items[0].name + '\nArtist: ' + response.tracks.items[0].artists[0].name + '\nAlbum: ' + response.tracks.items[0].album.name + '\nPreview: ' + response.tracks.items[0].preview_url + '\nFull Song: ' + response.tracks.items[0].external_urls.spotify);
        })
        .catch(function(err) {
            console.log(err)
        })

    })
};

  