require('dotenv').config();
const Joi = require('joi');

//dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(7000),

    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PROD_MONGODB_URL: Joi.string().required().description('PROD Mongo DB url'),
    DEV_MONGODB_URL: Joi.string().required().description('DEV Mongo DB url'),
    PROD_FRONTEND_URL: Joi.string().required().description('PROD frontend url'),
    DEV_FRONTEND_URL: Joi.string().required().description('DEV frontend url'),
    PINATA_KEY: Joi.string().required().description('JWT secret key'),
    PINATA_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(60)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description(
      'the from field in the emails sent by the app'
    ),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  port: envVars.PORT,
  port2: envVars.PORT2,
  env: envVars.NODE_ENV,
  frontendUrl: {
    prod: envVars.PROD_FRONTEND_URL,
    dev: envVars.DEV_FRONTEND_URL,
  },
  mongoose: {
    prod:
      envVars.PROD_MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    dev: envVars.DEV_MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  paypal: {
    prod: {
      clientId: envVars.CLIENT_ID_PROD,
      clientSecret: envVars.CLIENT_SECRET_PROD
    },
    dev: {
      clientId: envVars.CLIENT_ID_SANDBOX,
      clientSecret: envVars.CLIENT_SECRET_SANDBOX
    },
  },
};
