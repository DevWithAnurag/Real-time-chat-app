const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);
const users = {};

app.use(express.static('public'));

//middle ware
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

//io connection....
io.on('connection', (socket) => {
  const userName = socket.handshake.query.userName;
  users[socket.id] = userName;
  io.emit('user connected');

  socket.on('chat-message', (msg, name, pos) => {
    pos = "left";
    socket.broadcast.emit('chat message', msg, name, pos);
  });

  socket.on('new-joined', (name) => {
    io.emit('user-name', name);
  });

  socket.on('disconnect', () => {
    io.emit('leave');
    delete users[socket.id];
  });

});



server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});