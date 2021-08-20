const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();

// Socket IO
const socket = require('socket.io');

const between = require('./utils/random-numbers');

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
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const playersToStartGame = 3;
const selectedBoards = [];

io.on('connection', (socket) => {
  const clientsCount = io.engine.clientsCount;
  console.log('Socket connection opened:', socket.id);
  console.log('Total connections:', clientsCount);

  io.sockets.emit('players:count', clientsCount);

  const possibleBoards = [];
  const possibleBoardsStrings = [];

  while (possibleBoardsStrings.length < 3) {
    const b = between(1, 15, 5);
    const i = between(16, 30, 5);
    const n = between(31, 45, 4);
    const g = between(46, 60, 5);
    const o = between(61, 75, 5);

    const stringBingo =
      b.toString() +
      ',' +
      i.toString() +
      ',' +
      n.toString() +
      ',' +
      g.toString() +
      ',' +
      o.toString();

    if (
      possibleBoardsStrings.indexOf(stringBingo) === -1 &&
      selectedBoards.indexOf(stringBingo) === -1
    ) {
      possibleBoards.push([b, i, n, g, o]);
      possibleBoardsStrings.push(stringBingo);
      selectedBoards.push(stringBingo);
    }
  }

  socket.emit('boards:options', possibleBoards);
});
