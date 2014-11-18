/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var _ = require('underscore');
var fs = require('fs');
// var messages = [{username: 'arthur', text: 'hi'}, {username: 'bernie', text: 'hi'}];

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);
  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.


  var handlePOST = function(err){
    var serverResponse;
    if(err) {
      console.log(err);
      statusCode = 400;
      serverResponse = 'some error!';
    } else {
      statusCode = 201;
      serverResponse = 'message recorded';
    }
    headers['Content-Type'] = "plain/text";
    response.writeHead(statusCode, headers);
    response.end(serverResponse);
  };

  var handleGET = function(err, rawText){
    var serverResponse;
    if(err) {
      console.log(err);
      statusCode = 500;
      headers['Content-Type'] = "plain/text";
      serverResponse = 'our bad!';
    } else {
      statusCode = 200;
      headers['Content-Type'] = "application/json";

      var splitStream = rawText.split('\n');
      splitStream.pop();
      messages = _.map(splitStream, function(msg){
        return JSON.parse(msg);
      });
      var data = {results: messages.reverse()};
      serverResponse = JSON.stringify(data);
    }
    response.writeHead(statusCode, headers);
    response.end(serverResponse);

  };


  var goodURLs = ['/classes/messages','/classes/room','/classes/room1'];

  if (goodURLs.indexOf(request.url) !== -1) {

    if (request.method === 'POST') {
      var body = '';
      request.on('data', function (data) {
        body += data;
      });
      request.on('end', function () {
        var post = JSON.parse(body);
        var date = new Date();
        _.extend(post, { createdAt: date });
        // messages.push(post);
        fs.appendFile("./classes/messages/messages.txt", JSON.stringify(post) + '\n', handlePOST);
      });
    }
    if (request.method === 'GET') {
      console.log('get header: ', request.headers)
      fs.readFile("./classes/messages/messages.txt", "utf8", handleGET);

    }
    if (request.method === 'OPTIONS'){
      // console.log('Request:', request);
      // console.log('Header:',request.headers);
      // console.log('request["anb-api-key"]:',request['anb-api-key']);

      statusCode = 200;
      headers['Content-Type'] = "plain/text";
      response.writeHead(statusCode, headers);
      response.end("go");

      // statusCode = 200;
      // headers['Content-Type'] = "plain/text";
      // response.writeHead(statusCode, headers);
      // response.end("go");
    }
  } else {
    statusCode = 404;
    headers['Content-Type'] = "plain/text";
    response.writeHead(statusCode, headers);
    response.end('Resource not found!');
  }

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

};



// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept, AnB-API-Key",
  "access-control-max-age": 10 // Seconds.
};

module.exports.requestHandler = requestHandler;
