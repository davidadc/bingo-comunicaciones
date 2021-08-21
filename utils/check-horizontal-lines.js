const isValidSelectedNumber = require('./check-selected-number');

const isVerticalWinningLine = (
  selectedNumbers,
  verticalLine,
  currentNumbers,
) => {
  return verticalLine.every((verticalElement) => {
    if (!selectedNumbers.includes(verticalElement)) {
      return false;
    }

    if (!isValidSelectedNumber(verticalElement, currentNumbers)) {
      return false;
    }

    return true;
  });
};

const hasVerticalWinningLine = (selectedNumbers, card, currentNumbers) => {
  console.log(selectedNumbers, card);
  const winningLines = card.filter((verticalLine) => {
    return isVerticalWinningLine(selectedNumbers, verticalLine, currentNumbers);
  });

  console.log('Winning vertical lines array', winningLines);

  return winningLines.length > 0;
};

module.exports = hasVerticalWinningLine;
