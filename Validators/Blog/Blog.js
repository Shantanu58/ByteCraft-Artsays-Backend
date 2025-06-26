const Joi = require('joi');

const validateBlogPost = (data) => {
  const schema = Joi.object({
    blogName: Joi.string().required().min(5).max(255)
      .messages({
        'string.empty': 'Blog title is required',
        'string.min': 'Blog title should be at least 5 characters long',
        'string.max': 'Blog title should not exceed 255 characters'
      }),
    slug: Joi.string().required().pattern(new RegExp('^[a-z0-9]+(-[a-z0-9]+)*$'))
      .messages({
        'string.empty': 'Slug is required',
        'string.pattern.base': 'Slug can only contain lowercase letters, numbers, and hyphens'
      }),
    summary: Joi.string().required().min(20).max(300)
      .messages({
        'string.empty': 'Summary is required',
        'string.min': 'Summary should be at least 20 characters long',
        'string.max': 'Summary should not exceed 300 characters'
      }),
    blogDescription: Joi.string().required().min(100)
      .messages({
        'string.empty': 'Blog content is required',
        'string.min': 'Blog content should be at least 100 characters long'
      }),
    category: Joi.string().required()
      .messages({
        'string.empty': 'Category is required'
      }),
    tags: Joi.string().optional()
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = validateBlogPost;