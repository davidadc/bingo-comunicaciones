const getDiagonals = (card) => {
  const [b, i, n, g, o] = card;
  const main = [b[0], i[1], n[2], g[3], o[4]];
  const reverse = [b[4], i[3], n[2], g[1], o[0]];

  return [main, reverse];
};

module.exports = getDiagonals;
