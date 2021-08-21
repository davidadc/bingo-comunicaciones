const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();

// Socket IO
const socket = require('socket.io');

// Utils
const generateCards = require('./utils/generate-cards');

// Settings
app.set('port', process.env.PORT || 3002);

app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());

// Listen  the server
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

const playersToStartGame = parseInt(process.env.REACT_APP_NEEDED_PLAYERS);
const selectedCards = [];
const listedNumbers = [];

const getBingoNumber = (bingoNumbers) => {
  return bingoNumbers
    .splice(Math.floor(Math.random() * bingoNumbers.length), 1)
    .shift();
};

let interval;

const getNumberAndEmit = () => {
  if (!bingoNumbers.length) {
    clearInterval(interval);
    console.log('Listed numbers:', listedNumbers);
    return;
  }

  const number = getBingoNumber(bingoNumbers);

  listedNumbers.push(number);
  console.log('Listed number:', number, 'Remain numbers', bingoNumbers.length);

  io.sockets.emit('bingo:callNumber', number);
};

io.on('connection', (socket) => {
  const clientsCount = io.engine.clientsCount;
  console.log('Socket connection opened:', socket.id);
  console.log('IP:', socket.handshake.address);
  console.log('Total connections:', clientsCount);

  io.sockets.emit('players:count', clientsCount);

  const possibleCards = [];
  const possibleCardsStrings = [];

  generateCards(possibleCards, possibleCardsStrings, selectedCards);

  if (clientsCount === playersToStartGame) {
    // Initialize bingo count
    interval = setInterval(() => getNumberAndEmit(socket), 500);
  }

  socket.emit('cards:options', possibleCards);
});
