export const newError = (msg, statusCode) => {
  const error = new Error(msg);
  error.statusCode = statusCode;
  return error;
};
