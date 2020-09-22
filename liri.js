require ("dotenv").config();

var Spotfiy = require("node-spotify-api");

var keys = require("./keys");

var axios = require("axios");

var moment = require("moment");

var fs = require("fs")

var spotifyKeys = new Spotfiy(keys.spotify);

var artistName = function(artist) {
    return artist.name;
};

var spotifySearch = function(songName) {
    if (songName === undefined) {
        songName = "undefined";
    }


    spotifyKeys.search({
        type: "track",
        query: songName
    },
        function(err,data) {
            if (err) {
                console.log("Error ocurred:" + err);
                return;
            }
            var info = data.tracks.items;

            for (var i = 0; i < info.length; i++) {
                console.log(i);
                console.log("artist(s) " + info[i].artists.map(artistName));
                console.log("song name: " + info[i].name);
                console.log("album " + info[i].album.name);
                console.log("preview this song: " + info[i].preview_url);
            } 
        }    
    );
    };

    var Bands = function(artist) {
        var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
      
        axios.get(queryURL).then(
          function(response) {
            var jsonData = response.data;
      
            if (!jsonData.length) {
              console.log("No results found for " + artist);
              return;
            }
      
            console.log("Upcoming concerts for " + artist + ":");
      
            for (var i = 0; i < jsonData.length; i++) {
              var show = jsonData[i];
      
              // Print data about each concert
              // If a concert doesn't have a region, display the country instead
              // Use moment to format the date
              console.log(
                show.venue.city +
                  "," +
                  (show.venue.region || show.venue.country) +
                  " at " +
                  show.venue.name +
                  " " +
                  moment(show.datetime).format("MM/DD/YYYY")
              );
            }
          }
        );
      };
      
      var Movie = function(movieName) {
        if (movieName === undefined) {
          movieName = "undefined";
        }
      
        var urlHit =
          "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";
      
        axios.get(urlHit).then(
          function(response) {
            var jsonData = response.data;
      
            console.log("Title: " + jsonData.Title);
            console.log("Year: " + jsonData.Year);
            console.log("Rated: " + jsonData.Rated);
            console.log("IMDB Rating: " + jsonData.imdbRating);
            console.log("Country: " + jsonData.Country);
            console.log("Language: " + jsonData.Language);
            console.log("Plot: " + jsonData.Plot);
            console.log("Actors: " + jsonData.Actors);
            console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
          }
        );
      };
      
      var Run = function() {
        fs.readFile("random.txt", "utf8", function(error, data) {
          console.log(data);
      
          var dataArr = data.split(",");
      
          if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
          } else if (dataArr.length === 1) {
            pick(dataArr[0]);
          }
        });
      };
      
      
      var switcher = function(caseData, functionData) {
        switch (caseData) {
        case "concert-this":
          Bands(functionData);
          break;
        case "spotify-this-song":
          spotifySearch(functionData);
          break;
        case "movie-this":
          Movie(functionData);
          break;
        case "do-what-it-says":
          Run();
          break;
        default:
          console.log("LIRI doesn't know that");
        }
      };
      
      
      var runIt = function(argOne, argTwo) {
        switcher(argOne, argTwo);
      };
      
      
      runIt(process.argv[2], process.argv.slice(3).join(" "));
      