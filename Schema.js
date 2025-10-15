const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Title is required.",
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description is required.",
    }),
    category: Joi.string().required().messages({
      "string.empty": "Category is required.",
    }),
    price: Joi.number().min(0).required().messages({
      "number.base": "Price must be a number.",
      "any.required": "Price is required.",
    }),
    country: Joi.string().required().messages({
      "string.empty": "Country is required.",
    }),
    location: Joi.string().required().messages({
      "string.empty": "Location is required.",
    }),
    image: Joi.object({
      url: Joi.string().uri().allow(""),
      filename: Joi.string().allow(""),
    }).optional(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(3).max(500).required(),
  }).required(),
});
