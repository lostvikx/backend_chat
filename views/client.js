"use strict";
// const root = document.getElementById("root");
const message = document.getElementById("message");  // input
const messageBox = document.getElementById("messages");  // messageBox div
const form = document.getElementById("form");

const ws = new WebSocket("ws://localhost:8080");
console.log(ws);

// Names {subject to change!}
const names = ["Client: ", "Server: "];

// Btn to close the socket connection
const closeSocket = document.getElementById("closeSocket");

// Sending message event
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // I think this is asynchronous
  ws.send(String(message.value));

  // Create message bubble
  let text = document.createElement("p");
  text.innerText = names[0] + String(message.value);
  text.classList.add("text");
  messageBox.insertAdjacentElement("beforeend", text);

  // this ensures that we are always scrolled to the bottom
  messageBox.scrollTop = messageBox.scrollHeight;

  message.value = "";  // this might go wrong
});

// Receiving message event
ws.addEventListener("message", (event) => {
  // console.log(`Server: ${event.data}`);

  // Create message bubble
  let text = document.createElement("p");
  text.innerText = names[1] + String(event.data);
  text.classList.add("text");
  messageBox.insertAdjacentElement("beforeend", text);

  // more scroll
  messageBox.scrollTop = messageBox.scrollHeight;
});

// closeSocket Btn click
closeSocket.addEventListener("click", (e) => {
  e.preventDefault();
  // closing the WebSocket connection
  ws.close(1000, "Good Bye Server!");
});