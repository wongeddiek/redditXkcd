// const express = require('express');
// const app = express();

const request = require('request');
//cheerio parses html markups and implement JQuery to select DOM elements
const cheerio = require('cheerio');
//using snoowrap reddit api wrapper (rawjs )
const snoowrap = require('snoowrap');
//using snoostorm for reddit comment streams
const snoostorm = require("snoostorm");
//read/write local json file
const fs = require('fs');

//creating client credentials
const clientCred = JSON.parse(fs.readFileSync('credentials.json'));

//using snoowrap
const r = new snoowrap(clientCred);

//using snoostorm for commentstream
var client = new snoostorm(r);

var commentStream = client.CommentStream({
  "subreddit": "test", // optional, defaults to "all",
  "results": 25,              // The number of results to request per request, more the larger the subreddit, about how many results you should get in 2 seconds. Defaults to 5
  "pollTime": 2000           // Time in between polls in milliseconds, defaults to 2000, 30 times a minute, in accordance with Reddit's 60req/min, allowing you to perform both comment and submission updates. Note that snoowrap will automatically wait to be in compliance with Reddit's Guidelines
});

//request function to get explainxkcd html data
function urlRequest(url, cFunction) {
  request(url, function(error, response, body){
    cFunction(error, response, body);
  });
}

//header and footer to be appended with the explainxkcd comic comment reply
var header = "**I'm a bot, beep boop.  Explanation of this xkcd:**" + '\n';
var footer = '\n*---Comic explanation extracted from [explainxkcd](http://www.explainxkcd.com) | Bot created by u/thunderlordz *';

commentStream.on("comment", function(comment) {
  console.log(`New comment by ${comment.author.name}`);
  //regular expression pattern for the xkcd url
  var regexPatt = /[a-zA-z]*[0-9]*https*:\/\/www.xkcd.com\/[0-9]*/;
  if (regexPatt.test(comment.body)) {
    console.log('matched!');
    //getting the xkcd url from comment body
    var xkcd_url = comment.body.match(regexPatt)[0];
    //getting the comic number (number after the /) from xkcd url
    var urlNumber = Number(xkcd_url.match(/(?:\/)([0-9]+)/)[1]);
    //compiling the explainxkcd url
    var expxkcd_url = `https://www.explainxkcd.com/${urlNumber}`;

    //calling the urlRequest function to get the explainxkcd data
    urlRequest(expxkcd_url, function(error, response, body){
      if (error) {
        console.log('error: ' + error);
      }
      //load the html DOM to cheerio
      const $ = cheerio.load(body);
      var data = '';
      //compile the <p> tag text in the html
      $('p').each( function() {
        data += $(this).text() + '\n';
        if ($(this).next().prop('tagName') !== 'P') {
          return false;
        }
      });
      //send completed data as reddit comment
      comment.reply(header + data + footer);
    });
  }
});
