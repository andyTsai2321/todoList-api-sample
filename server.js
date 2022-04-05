const http = require("http");
const { v4: uuidv4 } = require("uuid");
const errHandle = require("./errorHandle");
const todos = [];
const requestListener = (req, res) => {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });
  if (req.url == "/todos" && req.method === "GET") {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    );
    res.end();
  } else if (req.url == "/todos" && req.method === "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(data).title;
        if (title !== undefined) {
          const obj = {
            title: title,
            id: uuidv4(),
          };
          res.writeHead(200, headers);
          todos.push(obj);
          res.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          );
          res.end();
        } else {
          errHandle(res);
        }
      } catch (error) {
        errHandle(res);
      }
    });
  } else if (req.url == "/todos" && req.method === "DELETE") {
    res.writeHead(200, headers);
    todos.length = 0;
    res.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    );
    res.end();
  } else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const getId = req.url.split("/").pop();
    const index = todos.findIndex((v) => v.id === getId);
    if (index !== -1) {
      res.writeHead(200, headers);
      todos.splice(index, 1);
      res.write(
        JSON.stringify({
          status: "success",
          data: todos,
        })
      );
      res.end();
    } else {
      errHandle(res);
    }
  } else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    req.on("end", () => {
      try {
        const title = JSON.parse(data).title;
        const getId = req.url.split("/").pop();
        const index = todos.findIndex((v) => v.id === getId);
        if (title !== undefined && index !== -1) {
          todos[index].title = title;
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          );
          res.end();
        } else {
          errHandle(res);
        }
      } catch (error) {
        errHandle(res);
      }
    });
  } else if (req.method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        message: "無資料",
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(3005);
