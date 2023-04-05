const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeaves, roomUsers} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'Chatville Bot'

// for client connection
io.on('connection', socket=>{
    socket.on('joinroom', ({username, room})=>{

        const user = userJoin(socket.id, username, room)
        socket.join(user.room)

        // welcome current user, only joined user sees this
        socket.emit('message', formatMessage(botName, 'Welcome to Chatville'))
    
        // broadcast for when user connects, every member besides new user sees this
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat!`))

        io.to(user.room).emit('roomusers', {
            room:user.room,
            users: roomUsers(user.room)
        })
    })
    console.log('New WS connection');


    // when clients disconnect, every member besides user that just left sees this
    socket.on('disconnect', ()=>{
        const user = userLeaves(socket.id)
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`))

            io.to(user.room).emit('roomusers', {
                room:user.room,
                users: roomUsers(user.room)
            })
        }
    });

    // listen for chat message
    socket.on('chatMessage', (msg)=>{
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })
});

const port = 4500

server.listen(port, ()=>console.log(`Server is listening on port ${port}`));