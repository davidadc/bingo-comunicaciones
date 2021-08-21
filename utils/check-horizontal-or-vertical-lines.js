const isValidSelectedNumber = require('./check-selected-number');

const isWinningLine = (selectedNumbers, verticalLine, currentNumbers) => {
  return verticalLine.every((verticalElement) => {
    if (verticalElement !== 0) {
      if (!selectedNumbers.includes(verticalElement)) {
        return false;
      }

      if (!isValidSelectedNumber(verticalElement, currentNumbers)) {
        return false;
      }
    }

    return true;
  });
};

const hasWinningLine = (selectedNumbers, card, currentNumbers) => {
  console.log(selectedNumbers, card);
  const winningLines = card.filter((verticalLine) => {
    return isWinningLine(selectedNumbers, verticalLine, currentNumbers);
  });

  console.log('Winning lines array', winningLines);

  return winningLines.length > 0;
};

module.exports = hasWinningLine;
