const express = require('express')
const fileupload = require('express-fileupload')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const http = require('http')
const socketIo = require('socket.io')
const dotenv = require('dotenv')
const { urlencoded } = require('body-parser')

const authRouter = require("./src/Routes/authRouter")
const userRouter = require("./src/Routes/userRouter")
const chatRouter = require("./src/Routes/chatRouter")
const messageRouter = require("./src/Routes/messageRouter")

dotenv.config()



const app = express()


const server = http.createServer(app)

const io = socketIo(server, {
  cors: {
    // origin:"*"
    origin: "http://localhost:3000",
    // methods: ['GET', 'POST']
  }
})


// to save files for public

app.use(express.static("src/public"))

// middlaawre
app.use(express.json());
app.use(fileupload({ useTempFiles: true }));
app.use(urlencoded({ extended: true }));
app.use(cors());

// Routes

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);


app.get("/", (req, res) => {
  res.send("chat app")
})

// websocket funksiyalari
let activeUsers = []
io.on("connection", (socket) => {
  socket.on('new-user-add', (newUserId) => {
    if (!activeUsers.some(user => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id })
    }
    console.log(activeUsers);
    io.emit('get-users', activeUsers)
  })

  socket.on('disconnect', () => {
    // remove user from active users list
    activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
    console.log(activeUsers);

    io.emit('get-users', activeUsers)
  })
  socket.on( "send-message", (data) =>{
    const {receivedId} = data
    const user  = activeUsers.find(user=> user.userId === receivedId);
    if(user){
      io.to(user.socketId).emit("receive-message",data)
    }
  })
})






const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;


mongoose.connect(MONGO_URL, {
  UseNewUrlParser: true,
  UseUnifiedTopology: true,
}).then(() => {
  server.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
}).catch(error => console.log(error))
