import CryptoJS from "crypto-js";

export const encrypt = ({ plaintext, secret = process.env.CRYPTO_SECRET }) => {
  return CryptoJS.AES.encrypt(plaintext, secret).toString();
};

export const decrypt = ({ ciphertext, secret = process.env.CRYPTO_SECRET }) => {
  return CryptoJS.AES.decrypt(ciphertext, secret).toString(CryptoJS.enc.Utf8);
};
