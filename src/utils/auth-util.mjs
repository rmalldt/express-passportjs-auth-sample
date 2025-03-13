import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const hashPassword = async pass => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  console.log('GenSalt: ', salt);
  return await bcrypt.hash(pass, salt);
};

export const comparePassword = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};
