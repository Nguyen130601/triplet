const express = require('express')
const mongoose = require('mongoose');
const path = require('path')
const cors = require('cors')
const app = express()
const Busboy = require('busboy')
const  { Server } = require("socket.io")
const { createServer } = require("http")
const { saveNode, nodeList, updateNode, deleteNode } = require('./models');
const mongodb = require('mongodb')


app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))


const mongoURI = 'mongodb+srv://jvldwin:jvldwin@triplet.mvtfw.mongodb.net/triplet?retryWrites=true&w=majority'



app.get('/', async (req, res) => {
    const result = await nodeList();
    res.send(result);
})
app.post('/upload', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    // res.json({ file: req.file });
    console.log('STILL OK')
    const busboy = new Busboy({ headers: req.headers })

    busboy.on('file', async function (fieldname, file, filename, encoding, mimetype) {
        console.log('NOT OK 1')
        const client = new mongodb.MongoClient(mongoURI)
        await client.connect()
        const db = client.db('triplet')
        const gfs = await new mongodb.GridFSBucket(db , {bucketName: 'uploads'} )
        file.pipe(gfs.openUploadStream(filename))
            .on('error', ()=>{
                console.log("Some error occured:"+error);
                res.send(error);
            })
            .on('finish', ()=>{
                console.log("done uploading");
                //process.exit(0);
                res.send('Done Uploading');
            })   


      });
      busboy.on('finish', function() {
        console.log("That's all folk")
      });  
      req.pipe(busboy)  
});

app.get("/images/:filename", async function(req, res){ 
    const client = new mongodb.MongoClient(mongoURI)
    await client.connect()
    const db = client.db('triplet')
    const gfs = await new mongodb.GridFSBucket(db , {bucketName: 'uploads'} )
    gfs.openDownloadStreamByName(req.params.filename)
    .pipe(res)
});

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
})

io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.username = username;
    next();
})

io.on("connection", (socket) => {
    console.log('SERVER CONNECTED')
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
        userID: id,
        username: socket.username,
        });
    }
    socket.emit("users", users);
    socket.on('node:create', async (msg) => {
        console.log(msg);
        socket.emit('node:create', msg)
        const { user, title, parentId , body, id, img} = msg
        await saveNode({
            id,
            user,
            title,
            body,
            hidden: false,
            votes: 1,
            childIds: [],
            parentId,
            img
        })
        await updateNode({id: parentId, childId: id, user:user, title:title, body:body, img:img})
    })
    socket.on('node:feed', async () => {
        const result = await nodeList();
        socket.emit('node:feed', result)
    })
    socket.on('node:delete', (msg) => {
        deleteNode(msg)
    })
});


httpServer.listen(4000)