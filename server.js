const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'Chatville Bot'

// for client connection
io.on('connection', socket=>{
    console.log('New WS connection');

    // welcome current user, only joined user sees this
    socket.emit('message', formatMessage(botName, 'Welcome to Chatville'))

    // broadcast for when user connects, every member besides new user sees this
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat!'))

    // when clients disconnect, every member besides user that just left sees this
    socket.on('disconnect', ()=>{
        io.emit('message', formatMessage(botName, 'User has left the chat'))
    })

    // listen for chat message
    socket.on('chatMessage', (msg)=>{
        io.emit('message', formatMessage('User', msg))
    })
})

const port = 4500

server.listen(port, ()=>console.log(`Server is listening on port ${port}`))