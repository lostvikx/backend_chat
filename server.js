#!/usr/bin/env node
"use strict";

const http = require("http");
const WebSocketServer = require("websocket").server;
const { readFile, createReadStream } = require("fs");
const path = require("path");
let connection = null;

// raw http server, this will help us create a TCP for websocket
const httpServer = http.createServer((req, res) => {
  // console.log(`Request for ${req.url}`);

  // Allows all requests {GET, POST, PUT, DELETE}
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Security-Policy", "connect-src 'self'");
  
  let filePath = `${__dirname}/views`;

  const mimeTypes = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };

  Object.freeze(mimeTypes);

  // Change to switch statements for routing pages.
  if (req.url == "/") {
    filePath += "/index.html";
  } else {
    filePath += String(req.url);
  }

  const extName = String(path.extname(filePath)).toLowerCase();

  // console.log(`path: ${filePath}, ext: ${extName}`);

  const readStream = createReadStream(filePath);

  readStream.on("error", (err) => {
    // console.error(err);
    res.statusCode = 404;
    if (extName === "") {
      readFile(`${__dirname}/views/404.html`, (err, data) => {
        if (err) {
          console.error(err);
        } else {
          res.setHeader("Content-Type", "text/html");
          res.end(data);
        }
      });
    } else {
      console.error(err);
      res.end();
    }
  });

  readStream.on("open", () => {
    res.statusCode = 200;
    res.setHeader("Content-Type", mimeTypes[extName]);
    readStream.pipe(res);
  });
});

httpServer.on("listening", () => console.log(`Listening on ${httpServer.address().port} at ${httpServer.address().address} ${httpServer.address().family}`));

// If we don't specify the ip address then http server listens on the public ip address.
// httpServer.listen(8080, "::1"); // IPv6 "::1" === "localhost"

httpServer.listen(8080, "localhost");

httpServer.on("error", (err) => console.error(err));

// TCP webSocket
const webSocket = new WebSocketServer({
  "httpServer": httpServer,
  "autoAcceptConnections": false,
});

webSocket.on("request", req => {
  // we create a connection, as we have not defined a sub-protocol: null is the default to accept the request
  connection = req.accept(null, req.origin);
  
  console.log("Connection Open!");

  // listening for a message, then sending a reply
  connection.on("message", message => {
    console.log(`Client: ${message.utf8Data}`);
    connection.send(`Got your message.`);
  });

  // event listeners, makes it stateful
  connection.on("error", () => console.error("Connection Error!"));

  connection.on("close", () => console.log("Connection Closed!"));

  // keepSending();

});

function keepSending() {
  connection.send(`Magic Number: ${Math.round(Math.random() * 100)}`);
  setTimeout(keepSending, 5000);
}
