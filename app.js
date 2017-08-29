// const express = require('express');
// const app = express();
//raw.js is a reddit api wrapper for node
// const rawjs = require('raw.js');
// const reddit = new rawjs("raw.js example script");

const request = require('request');
//cheerio parses html markups and implement JQuery to select DOM elements
const cheerio = require('cheerio');
//using snoowrap reddit api wrapper (rawjs )
const snoowrap = require('snoowrap');
//using snoostorm for reddit comment streams
const snoostorm = require("snoostorm");

//request function to get explainxkcd html data
function urlRequest(url, cFunction) {
  request(url, function(error, response, body){
    cFunction(error, response, body);
  });
}

var xkcdData ='';

xkcdData = urlRequest('https://www.explainxkcd.com/356', function(error, response, body){
  if (error) {
    console.log('error: ' + error);
  }
  const $ = cheerio.load(body);
  var data = '';
  $('p').each( function() {
    data += $(this).text() + '\n';
    if ($(this).next().prop('tagName') !== 'P') {
      return false;
    }
  });
  return data;
});

//creating client credentials
const clientCred = {
  userAgent: 'thunzBot',
  clientId: '3bC-WyZVJOJVJw',
  clientSecret: 'Upp9fSXTM8svRrbyZA4Aa4Htf4s',
  username: 'thunzBot',
  password: 'array!bot123'
};

//using snoowrap
const r = new snoowrap(clientCred);

//getting the test subreddit
// const subreddit = r.getSubreddit('test');

//using snoostorm for commentstream
var client = new snoostorm(r);

var commentStream = client.CommentStream({
  "subreddit": "test", // optional, defaults to "all",
  "results": 25,              // The number of results to request per request, more the larger the subreddit, about how many results you should get in 2 seconds. Defaults to 5
  "pollTime": 2000           // Time in between polls in milliseconds, defaults to 2000, 30 times a minute, in accordance with Reddit's 60req/min, allowing you to perform both comment and submission updates. Note that snoowrap will automatically wait to be in compliance with Reddit's Guidelines
});

commentStream.on("comment", function(comment) {
  console.log(`New comment by ${comment.author.name}`);
  if (comment.body.includes('thunzBot test')) {
    comment.reply('test bot in action!');
  }
});

//using raw.js
//authenticate Reddit using OAuth2
// reddit.setupOAuth2("3bC-WyZVJOJVJw", "Upp9fSXTM8svRrbyZA4Aa4Htf4s", "http://localhost:8080");
//
// reddit.auth({"username": "thunzBot", "password": "array!bot123"}, function(err, response) {
//   if(err) {
//     console.log("Unable to authenticate user: " + err);
//   } else {
//     reddit.me(function(err,response){
//
//       console.log(response.name + ' is authenticated');
//       //starts pulling comments after reddit authentication
//       console.log('getting reddit comments');
//
//       reddit.comments({"r": 'test', "limit": 100}, function(error, comments){
//         if(error) {
//           console.log('unable to get comments: ' + error);
//         } else {
//           //going through each comment body
//           comments.data.children.forEach(function(element){
//             console.log(element.data.link_url);
//             // if(element.data.body.includes("https://www.xkcd.com")){
//             //   console.log('match found! \n');
//             // }
//           });
//           // console.log(comments.data.children[0].data);
//         }
//       });
//     });
//   }
// });
