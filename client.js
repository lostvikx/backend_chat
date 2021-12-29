"use strict";

let ws = new WebSocket("ws://localhost:8080");

ws.addEventListener("open", () => {
  ws.send("Hello, Server!");
});

ws.addEventListener("message", (ev) => {
  console.log(`Message from server: ${ev.data}`)
});

ws.close("Bye Server!");