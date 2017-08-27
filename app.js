const express = require('express');
const app = express();
const request = require('request');
//cheerio parses html markups and implement JQuery to select DOM elements
const cheerio = require('cheerio');

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

//xkcdData is undefined because urlRequest() is asynchronous.
console.log(xkcdData);
