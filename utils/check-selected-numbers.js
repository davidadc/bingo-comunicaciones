const checkSelectedNumbers = (selectedNumbers, currentNumbers) => {
  if (
    selectedNumbers.length < 4 ||
    selectedNumbers.length > currentNumbers.length
  ) {
    return false;
  }
  return true;
};

module.exports = checkSelectedNumbers;
