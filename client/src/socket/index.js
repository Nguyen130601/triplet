import { io } from "socket.io-client";

const URL = "http://localhost:4000";
const socket = io(URL, { autoConnect: false });
const username = "Some random username"
socket.auth = { username };
socket.connect();

export default socket;