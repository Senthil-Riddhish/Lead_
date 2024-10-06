import joi from "joi";

export const ValidateSignup = (userData) => {
    const Schema = joi.object({
      firstname: joi.string().required().min(3),
      lastname: joi.string().required().min(1),
      email: joi.string().email().required(),
      password: joi.string().min(8),
      address: joi.string().required(),
      phoneNumber: joi.string().required(),
    });
    return Schema.validateAsync(userData);
};

export const ValidateSignin = (userData) => {
  const Schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });

  return Schema.validateAsync(userData);
};