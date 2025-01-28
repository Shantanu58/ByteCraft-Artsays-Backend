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

  Budget: Joi.number().required().messages({
    'number.base': 'Budget must be a number',
    'any.required': 'Budget is required',
  }),

  Artist: Joi.alternatives().try(
    Joi.object().keys({
      id: Joi.string().length(24).required().messages({
        'string.length': '"Artist.id" must be 24 characters long',
      }),
    }),
    Joi.string().length(24).required().messages({
      'string.length': '"Artist" must be 24 characters long',
    })
  ).required().messages({
    'any.required': '"Artist" is required',
  }),

  RequestStatus: Joi.string()
    .valid('Approved', 'Rejected', 'Pending')
    .default('Pending')
    .messages({
      'any.only': 'Request Status must be one of Approved, Rejected, or Pending',
    }),
});

module.exports = buyerRequestValidator;
