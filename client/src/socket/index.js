import { io } from "socket.io-client";

const URL = "http://localhost:4000";
const socket = io(URL, { autoConnect: false });
const username = "Some random username " + Math.floor(Math.random() * 10)
const sessionID = localStorage.getItem("sessionID");

if (sessionID) {
  socket.auth = { sessionID };
}
socket.auth = { username };
socket.connect();
socket.on("session", ({ sessionID, userID }) => {
  // attach the session ID to the next reconnection attempts
  socket.auth = { sessionID };
  // store it in the localStorage
  localStorage.setItem("sessionID", sessionID);
  // save the ID of the user
  socket.userID = userID;
});
export default socket;