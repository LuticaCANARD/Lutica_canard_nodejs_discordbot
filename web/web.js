//
const http = require('http');
const path = require('node:path');
const express = require('express')
 //Web server


http.createServer(function (request, response) 
{
	let web_url = './web/front'
	if(request.url=='/') {web_url += '/index.html'}
	else if(request.url=='/favicon.ico') {return response.writeHead(404);}
	else if(request.url.includes('.')) {web_url+=request.url;}
	else{web_url+=request.url+'.html';}
	if(fs.existsSync(web_url)==false)
	{
		response.writeHead(404);
		response.end('');
		return;
	}
	response.writeHead(200,{'Content-Type': 'text/html; charset=utf-8' });
	response.end(fs.readFileSync(web_url))
}).listen(process.env.WEBPORT||5005,()=>{console.log('Web server is ready!');});

/**
 *
const app = express();
var server=http.createServer(app)
server.listen(process.env.WEBPORT||5005,()=>{console.log('Web server is ready!');});
app.get('/healthcheck', (req, res) => {
    res.end('ok');
});
*/
 

// 수동서버

