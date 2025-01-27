const Joi = require('joi');

const buyerRequestValidator = Joi.object({
  ProductName: Joi.string().required().messages({
    'string.empty': 'Product Name is required',
    'any.required': 'Product Name is required',
  }),
  
  Description: Joi.string().required().messages({
    'string.empty': 'Description is required',
    'any.required': 'Description is required',
  }),
  
  // BuyerImage: Joi.string().pattern(/^data:image\/[a-zA-Z]+;base64,([A-Za-z0-9+/=]+)$/).required().messages({
  //   'string.empty': 'Buyer Image is required',
  //   'string.pattern.base': 'Buyer Image must be a valid base64-encoded image',
  // }),
  
  RequestStatus: Joi.string()
    .valid('Approved', 'Rejected', 'Pending')
    .default('Pending')
    .messages({
      'any.only': 'Request Status must be one of Approved, Rejected, or Pending',
    }),
});

module.exports = buyerRequestValidator;
