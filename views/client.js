"use strict";
const root = document.getElementById("root");

root.innerHTML("<p>Hello World!</p>");

let ws = new WebSocket("ws://localhost:8080");

ws.addEventListener("open", () => {
  ws.send("Hello, Server!");
});

ws.addEventListener("message", (ev) => {
  console.log(`Message from server: ${ev.data}`)
});

ws.close("Bye Server!");