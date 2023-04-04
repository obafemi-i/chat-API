const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')

const socket = io()

// get username and room from URL 
const { username, room } = qs.parse(location.search, {
    ignoreQueryPrefix:true
})

// message from server
socket.on('message', message=>{
    console.log(message);
    outputMessage(message)

    // scroll down
    chatMessage.scrollTop = chatMessage.scrollHeight
})

// submit message
chatForm.addEventListener('submit', e=>{
    e.preventDefault()

    // get message text
    const msg = e.target.elements.msg.value

    // emit message to server
    socket.emit('message', msg)

    // clear text box
    e.target.elements.msg.value = ''
    e.target.elements.msg.value.focus()
})

function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta"> ${message.username}
        <span> ${message.time} </span> </p>
            <p class="text">
                ${message.text}
                    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}