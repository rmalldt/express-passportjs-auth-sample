export const userValidationSchema = {
  email: {
    isEmail: true,
    normalizeEmail: true,
    errorMessage: 'Please enter a valid email.',
  },

  password: {
    isStrongPassword: {
      options: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      },
      errorMessage:
        'Please enter a password with at least 8 characters containing lowercase, uppercase, numbers and symbols.',
    },
  },

  displayName: {
    notEmpty: true,
    isString: true,
    errorMessage: 'Please enter a valid full name.',
  },
};
