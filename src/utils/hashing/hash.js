import bcrypt from "bcryptjs";

export const hash =({ plaintext, rounds = Number(process.env.ROUNDS) }) => {
  return bcrypt.hashSync(plaintext, rounds);
};

export const compare = ({ plaintext, hash }) => {
  return bcrypt.compareSync(plaintext, hash);
};

