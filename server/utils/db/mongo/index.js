import mongoose from 'mongoose';
import util from 'util';
import waitPort from 'wait-port';

import { db as dbConfig } from '../../../config';
import log from '../../logger';

const {
  mongo: { connectURI, connectOptions, port, host }
} = dbConfig;

mongoose.Promise = Promise;

mongoose.set('debug', (collectionName, method, query, doc) => {
  log.debug(`${collectionName}.${method} %s`, util.inspect(query, false, 20), doc);
});

mongoose.connection.on('connecting', () => log.debug('Trying to connect to MongoDB: %s', connectURI));
mongoose.connection.on('connected', () => log.debug('The connection established to MongoDB: %s', connectURI));
mongoose.connection.on('disconnected', () => log.debug('Disconnected from MongoDB: %s', connectURI));
mongoose.connection.on('reconnected', () => log.debug('Reconnected to MongoDB: %s', connectURI));

export const connect = async () => {
  try {
    if (mongoose.connection.readyState) {
      return mongoose.connection;
    }

    const connection = await mongoose.connect(connectURI, connectOptions);
    log.info(`Connected to MongoDB: ${connectURI}`);
    return connection;
  } catch (e) {
    log.error('Unable to connect to MongoDB: %s', connectURI);
    throw e;
  }
};

export const waitUntilMongoIsAlive = async (timer = 1000) => {
  return new Promise(res => {
    setTimeout(res, timer);
    waitPort({ host, port }).then(res);
  });
};
