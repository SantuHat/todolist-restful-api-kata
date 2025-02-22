const http = require('http');
const {v4:uuidv4} = require('uuid');
const errorHandle = require('./errorHandle');
const todos = [];

const reqListener = (req,res)=>{
  const headers = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json',
  };

  let body = '';
  req.on('data',chunk=>body+=chunk);

  if(req.url=="/todos"&& req.method=="GET"){
    res.writeHead(200,headers);
    res.write(JSON.stringify({
      "status":"success",
      "data":todos
    }))
    res.end();
  }else if(req.url=="/todos"&&req.method=="POST"){
    req.on('end',()=>{
      try{
        const title = JSON.parse(body).title;
        if(title!==undefined){
          const todo = {
            title,
            "id":uuidv4()
          }
          todos.push(todo);
          res.writeHead(200,headers);
          res.write(JSON.stringify({
            "status":"success",
            "data":todos
          }));
        }else{
          errorHandle(res);
        }
        res.end();
      }catch{
        errorHandle(res);
      }
    })
  }else if(req.url=="/todos"&&req.method=="DELETE"){
    todos.length = 0;
    res.writeHead(200,headers);
    res.write(JSON.stringify({
      "status":"success",
      "data":todos
    }));
    res.end();
  }else if(req.url.startsWith("/todos/")&&req.method=="DELETE"){
    const id = req.url.split('/').pop();
    console.log(id);
    const index = todos.findIndex(item=>item.id ==id);
    console.log(index);
    if(index!==-1){
      todos.splice(index,1);
      res.writeHead(200,headers);
      res.write(JSON.stringify({
        "status":"success",
        "data":todos
      }))
    }else{
      errorHandle(res);
    }
    res.end();
  }else if(req.url.startsWith("/todos/")&&req.method=="PATCH"){
    req.on('end',()=>{
      try{
        const id = req.url.split('/').pop();
        const index = todos.findIndex(item=>item.id == id);
        const title = JSON.parse(body).title;
        if(index!==-1&&title!==undefined){
          todos[index].title = title;
          res.writeHead(200,headers);
          res.write(JSON.stringify({
            "status":"success",
            "data":todos
          }));
        }else{
          errorHandle(res);
        }
        res.end();
      }catch{
        errorHandle(res);
      }
    })
  }else{
    res.writeHead(404,headers);
    res.write(JSON.stringify({
      "status": false,
      "message":"404，找不到此頁面"
    }))
    res.end();
  }
  
}

const server = http.createServer(reqListener);
server.listen(3005);