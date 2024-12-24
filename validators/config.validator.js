const Joi = require('joi');
const fs = require('fs');

// Load balancing algorithms
const LOAD_BALANCING_RULES = [
  'round-robin',
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
    ssl: Joi.bool()
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
    render: Joi.array().items(
      Joi.object({
        filename: Joi.string()
          .required(),
        location: Joi.string()
          .required(),
        templatePath: Joi.string()
          .required()
      })
    ),
    load_balancer: Joi.array().items(
      Joi.object({
        name: Joi.string()
          .required(),
        location:Joi.string()
        .required(),  
        upstream: Joi.string()
          .required(),
        algorithm: Joi.string()
          .valid(...LOAD_BALANCING_RULES)
          .required(),
        weight:Joi.array(),  
      })
    )
  }).required()
});

// Validation function
function validateConfig(path) {
  try {
    // Read and parse JSON config file
    const config = fs.readFileSync(path, 'utf8');
    const configObj = JSON.parse(config);

    // Validate the parsed config object against the schema
    const result = nginxConfigSchema.validate(configObj, {
      abortEarly: false,
      allowUnknown: false
    });

    if (result.error) {
      console.error('Validation Errors:', result.error.details.map(e => e.message).join('\n'));
      return { error: result.error.details };
    }

    console.log('Validation Successful!');
    return { value: result.value }; // Return the validated value
  } catch (error) {
    console.error('Error reading or parsing config:', error.message);
    return { error: `Invalid JSON format: ${error.message}` };
  }
}

module.exports = {
  validateConfig,
  nginxConfigSchema
};
