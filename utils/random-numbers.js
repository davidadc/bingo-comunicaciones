const between = (min, max, length) => {
  const array = [];

  while (array.length < length) {
    const number = Math.floor(Math.random() * (max - min + 1) + min);

    if (array.indexOf(number) === -1) {
      array.push(number);
    }
  }

  array.sort((a, b) => a - b);

  return array;
};

module.exports = between;
