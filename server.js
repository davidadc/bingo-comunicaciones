const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();

// Socket IO
const socket = require('socket.io');

// settings
app.set('port', process.env.PORT || 3002);

app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());

// listen the server
const server = app.listen(app.get('port'), () => {
  console.log('Listening on port', app.get('port'));
});

const bingoNumbers = Array(75)
  .fill(1)
  .map((x, y) => x + y);

const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const playersToStartGame = 3;

io.on('connection', (socket) => {
  const clientsCount = io.engine.clientsCount;
  console.log('Socket connection opened:', socket.id);
  console.log('Total connections:', clientsCount);

  io.sockets.emit('bingo:players', clientsCount);
});
