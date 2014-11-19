var _ = require('underscore');
var fs = require('fs');
var utils = require('./utils');

var handlePOST = function(err,response){
  if(err) {
    console.log(err);
    utils.sendResponse(response, 400, '"POST error!"');
  } else {
    utils.sendResponse(response, 201, '"POST success!"');// TODO: object id sent instead of string
  }
};

var handleGET = function(err, rawText, response){
  if(err) {
    utils.sendResponse(response, 500, 'GET error!');
  } else {

    var splitStream = rawText.split('\n');
    splitStream.pop();
    messages = _.map(splitStream, function(msg){
      return JSON.parse(msg);
    });
    var data = {results: messages.reverse()};
    utils.sendResponse(response, 200, JSON.stringify(data));
  }
};

var actions = {
  GET: function(request, response){
    fs.readFile("./classes/messages/messages.txt", "utf8", function(err, rawText){
      handleGET(err, rawText, response);
    });
  },
  POST: function(request, response){
    utils.parsePOST(request, function(body){
      var post = JSON.parse(body);
      var date = new Date();
      _.extend(post, { createdAt: date });
      fs.appendFile("./classes/messages/messages.txt", JSON.stringify(post) + '\n', function(err) {
        handlePOST(err,response);
      });
    });
  },
  OPTIONS: function(request, response){
    utils.sendResponse(response, 200, "'go'");
  }
};

module.exports = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  var goodURLs = ['/classes/messages','/classes/room','/classes/room1'];

  if (goodURLs.indexOf(request.url) !== -1) {

    if(actions[request.method]){
      actions[request.method](request, response);
    } else {
      //404
      utils.sendResponse(response, 404, "'Not Found'");
    }
  }

};
