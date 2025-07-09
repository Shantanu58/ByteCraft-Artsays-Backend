// const Joi = require('joi');

// const buyerRequestValidator = Joi.object({
//   ProductName: Joi.string().required().messages({
//     'string.empty': 'Product Name is required',
//     'any.required': 'Product Name is required',
//   }),

//   Description: Joi.string().required().messages({
//     'string.empty': 'Description is required',
//     'any.required': 'Description is required',
//   }),

//   Budget: Joi.number().required().messages({
//     'number.base': 'Budget must be a number',
//     'any.required': 'Budget is required',
//   }),

//   Artist: Joi.alternatives().try(
//     Joi.object().keys({
//       id: Joi.string().length(24).required().messages({
//         'string.length': '"Artist.id" must be 24 characters long',
//       }),
//     }),
//     Joi.string().length(24).required().messages({
//       'string.length': '"Artist" must be 24 characters long',
//     })
//   ).required().messages({
//     'any.required': '"Artist" is required',
//   }),

//   RequestStatus: Joi.string()
//     .valid('Approved', 'Rejected', 'Pending')
//     .default('Pending')
//     .messages({
//       'any.only': 'Request Status must be one of Approved, Rejected, or Pending',
//     }),
// });

// module.exports = buyerRequestValidator;

const Joi = require('joi');

const buyerRequestValidator = Joi.object({
  ProductName: Joi.string().required().messages({
    'string.empty': 'Product name is required',
    'any.required': 'Product name is required'
  }),

  Description: Joi.string().required().messages({
    'string.empty': 'Description is required',
    'any.required': 'Description is required'
  }),

  ArtType: Joi.string().required().messages({
    'string.empty': 'Art type is required',
    'any.required': 'Art type is required'
  }),

  Size: Joi.string().required().messages({
    'string.empty': 'Size is required',
    'any.required': 'Size is required'
  }),

  ColourPreferences: Joi.string().required().custom((value, helpers) => {
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) {
        return helpers.error('any.invalid');
      }
      return value;
    } catch (e) {
      return helpers.error('any.invalid');
    }
  }).messages({
    'string.empty': 'Color preferences are required',
    'any.required': 'Color preferences are required',
    'any.invalid': 'Color preferences must be a valid JSON array'
  }),

  IsFramed: Joi.boolean().required().messages({
    'boolean.base': 'Frame requirement must be true or false',
    'any.required': 'Frame requirement is required'
  }),

  MinBudget: Joi.number().positive().required().messages({
    'number.base': 'Minimum budget must be a number',
    'number.positive': 'Minimum budget must be positive',
    'any.required': 'Minimum budget is required'
  }),

  MaxBudget: Joi.number().positive().greater(Joi.ref('MinBudget')).required().messages({
    'number.base': 'Maximum budget must be a number',
    'number.positive': 'Maximum budget must be positive',
    'number.greater': 'Maximum budget must be greater than minimum budget',
    'any.required': 'Maximum budget is required'
  }),

  PaymentTerm: Joi.string().valid('Full Payment', 'Installment', 'Two Step Payment').required().messages({
    'string.empty': 'Payment term is required',
    'any.only': 'Payment term must be one of: full, installment, two-step',
    'any.required': 'Payment term is required'
  }),

  InstallmentDuration: Joi.number().integer().valid(3, 6, 9, 12, 24)
    .when('PaymentTerm', {
      is: 'Installment',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'any.required': 'Installment duration is required when payment term is Installment',
      'any.only': 'Installment duration must be one of 3, 6, 9, 12, or 24 months'
    }),

  ExpectedDeadline: Joi.number().integer().positive().required().messages({
    'number.base': 'Deadline must be a number',
    'number.integer': 'Deadline must be an integer',
    'number.positive': 'Deadline must be positive',
    'any.required': 'Deadline is required'
  }),

  Comments: Joi.string().allow('').optional(),

  Artist: Joi.alternatives().try(
    Joi.object().keys({
      id: Joi.string().hex().length(24).required()
    }),
    Joi.string().hex().length(24).required()
  ).required().messages({
    'string.empty': 'Artist selection is required',
    'string.length': 'Artist ID must be 24 characters',
    'string.hex': 'Artist ID must be a valid hexadecimal',
    'any.required': 'Artist selection is required'
  }),
  BuyerSelectedAddress: Joi.object({
    line1: Joi.string().required().messages({
      'string.empty': 'Address line 1 is required'
    }),
    line2: Joi.string().allow(''),
    landmark: Joi.string().allow(''),
    city: Joi.string().required().messages({
      'string.empty': 'City is required'
    }),
    state: Joi.string().required().messages({
      'string.empty': 'State is required'
    }),
    country: Joi.string().required().messages({
      'string.empty': 'Country is required'
    }),
    pincode: Joi.string().required().messages({
      'string.empty': 'Pincode is required'
    })
  }),
  RequestStatus: Joi.string()
    .valid('Approved', 'Rejected', 'Pending', 'Negotiating')
    .default('Pending')
    .messages({
      'any.only': 'Status must be one of: Approved, Rejected, Pending, Negotiating'
    })
}).options({ abortEarly: false });

module.exports = buyerRequestValidator;
