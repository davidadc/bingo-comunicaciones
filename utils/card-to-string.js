const cardToString = (card) => {
  const b = card[0],
    i = card[1],
    n = card[2],
    g = card[3],
    o = card[4];

  return `${b.toString()},${i.toString()},${n.toString()},${g.toString()},${o.toString()}`;
};

module.exports = cardToString;
