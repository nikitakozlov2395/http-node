const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const getData = (request, callback) => {
	let body = [];
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      body = Buffer.concat(body).toString();
        if (request.headers['content-type'] === 'application/json') {
          callback(JSON.parse(body))
        } else {
          callback(querystring.parse(body)) 
        }
    });
}

const server = http.createServer((request, response) => {

	if (request.method === 'POST' && request.url === '/hello') {
    	getData(request, function(data) {
      		response.end(`Hello ${data.name}, you are ${data.age} old!`); 
    	})
  	} else if (request.url === '/' || request.url === '/hello') {
   		response.writeHeader(200, {"Content-Type": 'text/html'});  
    	const readStream = fs.createReadStream('index.html','utf8')
    	readStream.pipe(response);
  	} else {
      response.writeHeader(404, {"Content-Type": 'text/html'});  
      const readStream = fs.createReadStream('404.html','utf8')
      readStream.pipe(response);
    }

}).listen(3000, () => console.log('Server is open'));