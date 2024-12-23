const Joi = require('joi');
const fs = require('fs');

const LOAD_BALANCING_RULES = [
  'round-robin',
  'least-connections',
  'ip-hash',
  'random',
  'weighted'
];

// Schema for the entire configuration
const nginxConfigSchema = Joi.object({
  nginx: Joi.object({
    port: Joi.number()
      .port()
      .required(),
    worker_processes: Joi.number()
      .integer()
      .min(1)
      .max(32)
      .required(),
    host: Joi.string()
      .hostname()
      .required(),
    upstreams: Joi.array().items(
      Joi.object({
        name: Joi.string()
          .required()
          .pattern(/^[a-zA-Z0-9_-]+$/),
        servers: Joi.array()
          .items(
            Joi.string()
              .uri()
              .required()
          )
          .min(1)
          .required()
      })
    ).required(),
    proxies: Joi.array().items(
      Joi.object({
        name: Joi.string()
          .required()
          .pattern(/^[a-zA-Z0-9_-]+$/),
        location: Joi.string()
          .required()
          .pattern(/^\/[\w\-\/]*$/),
        upstream: Joi.string()
          .required(),
        rules: Joi.string()
          .valid(...LOAD_BALANCING_RULES)
          .default('round-robin')
      })
    ).required(),
    render:Joi.array().items(
      Joi.object({
        filename: Joi.string()
          .required(),
        location: Joi.string()
          .required(),
        templatePath: Joi.string()
          .required()  
      })
    )
  }).required()
});

// Validation function
function validateConfig(path) {
  try {
    // If config is a string, parse it first
    const config = fs.readFileSync(path, 'utf8');
    const configObj = typeof config === 'string' ? JSON.parse(config) : config;

    const result = nginxConfigSchema.validate(configObj, {
      abortEarly: false,
      allowUnknown: false
    });
    if(result.error) {
      console.error('Validation error:', result.error.message);
    }
    //console.log('Validation successfully done');
    return result;

    return result;
  } catch (error) {
    return { error: `Invalid JSON format: ${error.message}` };
  }
}

module.exports = {
  validateConfig,
  nginxConfigSchema
};