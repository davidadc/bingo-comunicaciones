const isValidSelectedNumber = (selectedNumber, currentNumbers) => {
  return currentNumbers.includes(selectedNumber);
};

module.exports = isValidSelectedNumber;
