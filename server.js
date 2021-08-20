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
const selectedCards = [];
const listedNumbers = [];

const getBingoNumber = (bingoNumbers) => {
  return bingoNumbers.splice(Math.floor(Math.random() * bingoNumbers.length), 1).shift();
};

let interval;

const getNumberAndEmit = socket => {
  if (!bingoNumbers.length) {
    clearInterval(interval);
    console.log('Listed numbers:', listedNumbers);
    return;
  }

  const number = getBingoNumber(bingoNumbers);

  listedNumbers.push(number);
  console.log('Listed number:', number, 'Remain numbers', bingoNumbers.length);

  socket.emit('bingo:callNumber', number);
};

io.on('connection', (socket) => {
  const clientsCount = io.engine.clientsCount;
  console.log('Socket connection opened:', socket.id);
  console.log('Total connections:', clientsCount);

  io.sockets.emit('players:count', clientsCount);

  const possibleCards = [];
  const possibleCardsStrings = [];

  while (possibleCardsStrings.length < 3) {
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
      possibleCardsStrings.indexOf(stringBingo) === -1 &&
      selectedCards.indexOf(stringBingo) === -1
    ) {
      possibleCards.push([b, i, n, g, o]);
      possibleCardsStrings.push(stringBingo);
    }
  }

  if (clientsCount === playersToStartGame) {
    // Initialize bingo count
    interval = setInterval(() => getNumberAndEmit(socket), 500);
  }

  socket.emit('cards:options', possibleCards);
});
