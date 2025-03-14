export const newError = (statusCode, message, data) => {
  if (message === 'internal') {
    console.log('INTERNAL ERROR!: ', data);
    message = 'Please try again later. Sorry for the inconvenience.';
    data = null;
    statusCode = statusCode || 500;
  }

  const error = new Error(message);
  error.statusCode = statusCode;
  error.data = data;
  return error;
};
