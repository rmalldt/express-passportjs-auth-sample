export const newError = (msg, statusCode, data = null) => {
  const error = new Error(msg);
  error.statusCode = statusCode;
  error.data = data;
  return error;
};
