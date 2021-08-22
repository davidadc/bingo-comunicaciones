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
const checkSelectedNumbers = require('./utils/check-selected-numbers');
const hasWinningLine = require('./utils/check-horizontal-or-vertical-lines');
const getDiagonals = require('./utils/get-diagonal-lines');

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

// Global Variables
const playersToStartGame = parseInt(process.env.REACT_APP_NEEDED_PLAYERS);
const selectedCards = [];
const selectedCardsMapped = {};
const listedNumbers = [];
const remainingBingoNumbers = [...bingoNumbers];
let bingoNumberInterval = null;
let countdownInterval = null;
let timer = 11;

// Intervals
const getBingoNumber = (bingoNumbers) => {
  return bingoNumbers
    .splice(Math.floor(Math.random() * bingoNumbers.length), 1)
    .shift();
};

const getBingoNumberInterval = () => {
  const getNumberAndEmit = () => {
    if (!remainingBingoNumbers.length) {
      clearInterval(bingoNumberInterval);
      console.log('Listed numbers:', listedNumbers);
      return;
    }

    const number = getBingoNumber(remainingBingoNumbers);

    listedNumbers.push(number);
    console.log(
      'Listed number:',
      number,
      'Remain numbers',
      remainingBingoNumbers.length,
    );

    io.sockets.emit('bingo:callNumber', number);
  };

  bingoNumberInterval = setInterval(() => getNumberAndEmit(), 10000);
};

const getBingoStartTimerInterval = () => {
  countdownInterval = setInterval(() => {
    io.sockets.emit('game:time', (timer -= 1));
    console.log('Time to start:', timer);
    if (timer === 0) {
      clearInterval(countdownInterval);
      getBingoNumberInterval();
    }
  }, 1000);
};

io.on('connection', (socket) => {
  if (timer < 10) {
    timer = 11;
    clearInterval(countdownInterval);
  }

  const clientsCount = io.engine.clientsCount;
  console.log('Socket connection opened:', socket.id);
  console.log('IP:', socket.handshake.address);
  console.log('User ID:', socket.handshake.query?.userId);
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
    const cardString = cardToString(data?.card);

    if (selectedCards.indexOf(cardString) === -1) {
      selectedCards.push(cardString);
      selectedCardsMapped[data?.userId] = {
        card: data?.card,
        cardString,
      };
    }

    // Initialize bingo count
    if (selectedCards.length >= playersToStartGame) {
      getBingoStartTimerInterval();
    }
  });

  socket.on('bingo:callBingo', (data) => {
    const { userId, selected } = data;

    if (!checkSelectedNumbers(selected)) {
      return;
    }

    const userCard = selectedCardsMapped[userId]['card'];

    if (userCard[2][2] !== 0) {
      userCard[2].splice(2, 0, 0);
    }

    const isVerticalWinner = hasWinningLine(selected, userCard, listedNumbers);

    const transposeCard = Object.keys(userCard[0]).map((colNumber) =>
      userCard.map((rowNumber) => rowNumber[colNumber]),
    );

    const isHorizontalWinner = hasWinningLine(
      selected,
      transposeCard,
      listedNumbers,
    );

    const diagonalLines = getDiagonals(userCard);

    const isDiagonalWinner = hasWinningLine(
      selected,
      diagonalLines,
      listedNumbers,
    );

    if (isVerticalWinner || isHorizontalWinner || isDiagonalWinner) {
      clearInterval(bingoNumberInterval);

      socket.emit('player:winner', 'Ha ganado');

      socket.broadcast.emit(
        'players:winner',
        `El jugador con id ${userId} ha ganado.`,
      );
    }

    console.log('User', userId, ' called Bingo.');
    console.log('Vertical winner', isVerticalWinner);
    console.log('Horizontal winner', isHorizontalWinner);
    console.log('Diagonal winner', isDiagonalWinner);
  });

  socket.on('disconnect', () => {
    io.sockets.emit('players:count', io.engine.clientsCount);

    const cardString =
      selectedCardsMapped[socket.handshake.query?.userId]['cardString'];
    const index = selectedCards.indexOf(cardString);
    selectedCards.splice(index, 1);

    delete selectedCardsMapped[socket.handshake.query?.userId];

    if (selectedCards.length < playersToStartGame) {
      timer = 11;
      clearInterval(countdownInterval);
    }
  });
});
