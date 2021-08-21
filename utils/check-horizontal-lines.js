const isValidSelectedNumber = require('./check-selected-number');

const isVerticalWinningLine = (
  selectedNumbers,
  horizontalLine,
  currentNumbers,
) => {
  return horizontalLine.every((horizontalElement) => {
    if (!selectedNumbers.includes(horizontalElement)) {
      return false;
    }

    if (!isValidSelectedNumber(horizontalElement, currentNumbers)) {
      return false;
    }

    return true;
  });
};

const hasVerticalWinningLine = (selectedNumbers, card, currentNumbers) => {
  console.log(selectedNumbers, card);
  const winningLines = card.filter((horizontalLine) => {
    return isVerticalWinningLine(
      selectedNumbers,
      horizontalLine,
      currentNumbers,
    );
  });

  console.log('Winning vertical lines array', winningLines);

  return winningLines.length > 0;
};

module.exports = hasVerticalWinningLine;
