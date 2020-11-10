const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 5000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


const io = require('socket.io')(http)

const users = {}

function WhoAreOnline(){
  var ret = "";
  var p = Object.keys(users).length
  for(var i in users){
    ret=ret+(users[i]+", ")
  }
  if(p==1){
    ret+="is online"
  }
  else{
    ret+="are online"
  }
  return ret;
}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
    console.log(WhoAreOnline())
    io.emit('show-online',WhoAreOnline())
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    console.log(WhoAreOnline())
    //io.emit('show-online',WhoAreOnline())
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
    console.log(WhoAreOnline())
    io.emit('show-online',WhoAreOnline())
  })
})