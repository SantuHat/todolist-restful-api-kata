const http = require('http');

const requestListener = (req, res)=>{
  console.log(req.url);
  console.log(req.method);
  
  res.writeHead(200,{"Content-Type":"text/plain"});
  res.write('hi');
  res.end();
}

const server = http.createServer(requestListener);
server.listen(3005);