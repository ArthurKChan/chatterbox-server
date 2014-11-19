var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept, AnB-API-Key",
  "access-control-max-age": 10, // Seconds.
  "Content-Type" : "application/json"

};

exports.sendResponse = function(response, statusCode, message){
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(message);
};
exports.parsePOST = function(request, callback){
  var body = '';
  request.on('data', function (data) {
    body += data;
  });
  request.on('end', function (){
    callback(body);
  });
};
