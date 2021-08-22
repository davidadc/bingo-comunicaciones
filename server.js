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
const { encryptData, decryptData } = require('./utils/crypto-data');

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
let selectedCards = [];
let selectedCardsMapped = {};
let listedNumbers = [];
let remainingBingoNumbers = [...bingoNumbers];
let bingoNumberInterval = null;
let countdownInterval = null;
let timer = 11;
let isGameStarted = false;

const resetVariables = () => {
  selectedCards = [];
  selectedCardsMapped = {};
  listedNumbers = [];
  remainingBingoNumbers = [...bingoNumbers];
  bingoNumberInterval = null;
  countdownInterval = null;
  timer = 11;
  isGameStarted = false;
};

// Intervals
const getBingoNumber = (bingoNumbers) => {
  return bingoNumbers
    .splice(Math.floor(Math.random() * bingoNumbers.length), 1)
    .shift();
};

const getBingoNumberInterval = () => {
  isGameStarted = true;

  const getNumberAndEmit = () => {
    if (!remainingBingoNumbers.length) {
      clearInterval(bingoNumberInterval);
      console.log('Listed numbers:', listedNumbers);
      io.sockets.emit('game:over', encryptData(true));
      io.disconnectSockets();
      resetVariables();
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

    io.sockets.emit('bingo:callNumber', encryptData(number));
  };

  bingoNumberInterval = setInterval(() => getNumberAndEmit(), 10000);
};

const getBingoStartTimerInterval = () => {
  countdownInterval = setInterval(() => {
    io.sockets.emit('game:time', encryptData((timer -= 1)));
    console.log('Time to start:', timer);
    if (timer === 0) {
      clearInterval(countdownInterval);
      getBingoNumberInterval();
    }
  }, 1000);
};

io.on('connection', (socket) => {
  if (timer <= 11 && !isGameStarted) {
    timer = 11;
    clearInterval(countdownInterval);
  }
  console.log('Is game started:', isGameStarted);
  if (isGameStarted) {
    socket.emit('game:wait', encryptData(true));
    socket.disconnect();
    return;
  }

  const clientsCount = io.engine.clientsCount;
  console.log('Socket connection opened:', socket.id);
  console.log('IP:', socket.handshake.address);
  console.log('Total connections:', clientsCount);

  // Count of players
  io.sockets.emit('players:count', encryptData(clientsCount));

  const possibleCards = [];
  const possibleCardsStrings = [];

  // Send card options
  generateCards(possibleCards, possibleCardsStrings, selectedCards);
  socket.emit('cards:options', encryptData(possibleCards));

  // Card Selected
  socket.on('card:selected', function (data) {
    data = decryptData(data);

    const cardString = cardToString(data?.card);

    if (selectedCards.indexOf(cardString) === -1) {
      socket.data.userId = data?.userId;
      selectedCards.push(cardString);
      selectedCardsMapped[data?.userId] = {
        card: data?.card,
        cardString,
      };
    }

    // Initialize bingo count
    if (
      selectedCards.length >= playersToStartGame &&
      selectedCards.length === io.engine.clientsCount &&
      !isGameStarted
    ) {
      if (timer <= 11) {
        timer = 11;
        clearInterval(countdownInterval);
      }
      getBingoStartTimerInterval();
    }
  });

  socket.on('bingo:callBingo', (data) => {
    data = decryptData(data);

    const { userId, selected } = data;

    if (!checkSelectedNumbers(selected) || !isGameStarted) {
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

      socket.emit('player:winner', encryptData('Ha ganado'));

      socket.broadcast.emit(
        'players:winner',
        encryptData(`El jugador con id ${userId} ha ganado.`),
      );
    }

    console.log('User', userId, ' called Bingo.');
    console.log('Vertical winner', isVerticalWinner);
    console.log('Horizontal winner', isHorizontalWinner);
    console.log('Diagonal winner', isDiagonalWinner);
  });

  socket.on('disconnect', () => {
    io.sockets.emit('players:count', encryptData(io.engine.clientsCount));
    if (Object.keys(selectedCardsMapped).length > 0) {
      try {
        const cardString =
          selectedCardsMapped[socket.data.userId]['cardString'];
        const index = selectedCards.indexOf(cardString);
        selectedCards.splice(index, 1);

        delete selectedCardsMapped[socket.data.userId];
      } catch (e) {
        console.log(e);
      }
      if (selectedCards.length < playersToStartGame) {
        timer = 11;
        clearInterval(countdownInterval);
      }
    }
  });
});
