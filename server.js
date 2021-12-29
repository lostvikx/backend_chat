"use strict";

const http = require("http");
const WebSocketServer = require("websocket").server

// raw http server, this will help us create a TCP for websocket
const httpServer = http.createServer((req, res) => {
  console.log("Server received a request!");
  // res.write("hello");
  // res.end();
});

httpServer.listen(8080, () => console.log("listening on http://localhost:8080"));

const webSocket = new WebSocketServer({
  "httpServer": httpServer,
  // "autoAcceptConnections": false,
});

webSocket.on("request", req => {
  // we create a connection, as we have not defined a sub-protocol: null is the default to accept the request
  const connection = req.accept(null, req.origin);

  // listener function
  connection.on("error", () => console.error("error"));
  connection.on("close", () => console.log("Connection Closed!"));

  // listening for a message, then sending a reply
  connection.on("message", message => {
    console.log("Received Message");
    connection.send(`Re: Got your message: ${message.utf8Data}`);
  });

  // listening for open, sending a message
  connection.on("open", () => connection.send("Hello there, client! This is a test message."));
});

