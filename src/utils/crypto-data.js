const CryptoJS = require('crypto-js');
const PRIVATE_KEY = process.env.REACT_APP_SECRET_KEY;

const encryptData = (data) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    PRIVATE_KEY,
  ).toString();

  return encryptedData;
};

const decryptData = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, PRIVATE_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

module.exports = {
  encryptData,
  decryptData,
};
