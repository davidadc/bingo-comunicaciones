const between = require('./random-numbers');

const generateCards = (possibleCards, possibleCardsStrings, selectedCards) => {
  while (possibleCardsStrings.length < 3) {
    const b = between(1, 15, 5);
    const i = between(16, 30, 5);
    const n = between(31, 45, 4);
    const g = between(46, 60, 5);
    const o = between(61, 75, 5);

    const stringBingo =
      b.toString() +
      ',' +
      i.toString() +
      ',' +
      n.toString() +
      ',' +
      g.toString() +
      ',' +
      o.toString();

    if (
      possibleCardsStrings.indexOf(stringBingo) === -1 &&
      selectedCards.indexOf(stringBingo) === -1
    ) {
      possibleCards.push([b, i, n, g, o]);
      possibleCardsStrings.push(stringBingo);
    }
  }
};

module.exports = generateCards;
