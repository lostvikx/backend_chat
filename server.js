#!/usr/bin/env node
"use strict";

const http = require("http");
const WebSocketServer = require("websocket").server;
let connection = null;

// raw http server, this will help us create a TCP for websocket
const httpServer = http.createServer((req, res) => {
  console.log(`Request for ${req.url}`);
  res.writeHead(200, {
    "Connection": "keep-alive",
    // "Content-type": "text/html",
    "Access-Control-Allow-Origin": "*"
  });
  res.writeHead(404);
  res.end();
});

httpServer.listen(8080, () => console.log("Server listening on http://localhost:8080"));

// TCP webSocket
const webSocket = new WebSocketServer({
  "httpServer": httpServer,
  "autoAcceptConnections": false
});

webSocket.on("request", req => {
  // we create a connection, as we have not defined a sub-protocol: null is the default to accept the request
  connection = req.accept(null, req.origin);
  console.log("Connection Accepted!");

  // listening for open, sending a message
  connection.on("open", () => {
    console.log("Connection Opened!");
    // connection.send("Hello there, client! This is a test message.")
  });

  // event listeners, makes it stateful
  connection.on("error", () => console.error("Connection Error!"));
  
  connection.on("close", () => console.log("Connection Closed!"));

  // listening for a message, then sending a reply
  connection.on("message", message => {
    // console.log("Received Message");
    connection.send(`Got your message: ${message.utf8Data}`);
  });
});

