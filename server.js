#!/usr/bin/env node
"use strict";

const http = require("http");
const WebSocketServer = require("websocket").server;
const { readFile } = require("fs")
let connection = null;

// raw http server, this will help us create a TCP for websocket
const httpServer = http.createServer((req, res) => {
  // console.log(`Request for ${req.url}`);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/html");
  // res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Security-Policy", "connect-src 'self'");
  
  let path = `${__dirname}/views/`;

  switch (req.url) {
    case "/":
      path += "index.html";
      res.statusCode = 200;
      break;

    default:
      path += "404.html";
      res.statusCode = 404;
  }

  readFile(path, (err, data) => {
    if (err) {
      console.error(err);
      res.end();
    } else {
      res.end(data);
    }
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
