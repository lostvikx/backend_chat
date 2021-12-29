"use strict";

const http = require("http");
const WebSocketServer = require("websocket").server

// raw http server, this will help us create a TCP for websocket
const httpServer = http.createServer((req, res) => {
  console.log("Server received a request!");
});

// httpServer.listen(8080, ())