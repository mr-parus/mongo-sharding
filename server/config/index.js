export const ENVIRONMENT = process.env.NODE_ENV || 'development';
const isDevelopment = ENVIRONMENT === 'development';

const MONGO_USER = 'admin';
const MONGO_PASSWORD = 'admin';
const MONGO_HOST = 'localhost';
const MONGO_PORT = 27017;
const MONGO_DB = 'db';

export const db = {
  mongo: {
    connectOptions: {
      autoIndex: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    connectURI: `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`
  }
};

export const server = {
  port: 3000
};

export const logger = {
  level: isDevelopment ? 'debug' : 'error'
};
