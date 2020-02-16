export const ENVIRONMENT = process.env.NODE_ENV || 'development';
const isDevelopment = ENVIRONMENT === 'development';

const {
  MONGO_DB_NAME = 'db',
  MONGO_HOST = 'localhost',
  MONGO_PASSWORD = 'admin',
  MONGO_PORT = '27017',
  MONGO_USER = 'admin'
} = process.env;

export const db = {
  mongo: {
    connectOptions: {
      autoIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    connectURI: `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`
  }
};

export const server = {
  port: 3000
};

export const logger = {
  level: isDevelopment ? 'debug' : 'error'
};
