const request = require('request');
const cheerio = require('cheerio');

//request function to get explainxkcd html data
function urlRequest(url, cFunction) {
  request(url, function(error, response, body){
    cFunction(error, response, body);
  });
}

var expxkcd_url = `https://www.explainxkcd.com/980`;

urlRequest(expxkcd_url, function(error, response, body){
  if (error) {
    console.log('error: ' + error);
  }
  //load the html DOM to cheerio
  const $ = cheerio.load(body);
  var data = '';
  //compile the <p> tag text in the html
  $('#Explanation').parent().nextAll('p').each( function() {
    data += $(this).text() + '\n';
    if ($(this).next().prop('tagName') === 'H2') {
      return false;
    }
  });
  //send completed data as reddit comment
  // comment.reply(header + data + footer);
  console.log(data);
});
