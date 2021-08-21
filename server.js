const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();

// Socket IO
const socket = require('socket.io');

// Utils
const generateCards = require('./utils/generate-cards');
const cardToString = require('./utils/card-to-string');

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
const selectedCardsMapped = {};
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

  // Count of players
  io.sockets.emit('players:count', clientsCount);

  const possibleCards = [];
  const possibleCardsStrings = [];

  // Send card options
  generateCards(possibleCards, possibleCardsStrings, selectedCards);
  socket.emit('cards:options', possibleCards);

  // Card Selected
  socket.on('card:selected', function (data) {
    // console.log('data', data);
    const cardString = cardToString(data?.card);

    if (selectedCards.indexOf(cardString) === -1) {
      selectedCards.push(cardString);
    }

    // Initialize bingo count
    if (selectedCards.length >= playersToStartGame) {
      interval = setInterval(() => getNumberAndEmit(socket), 500);
    }
  });
});
