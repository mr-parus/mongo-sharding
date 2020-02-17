import http from 'http';
import { app } from './app';

import { server as serverConfig } from './config';
import { connect as connectToMongoDb, waitUntilMongoIsAlive } from './utils/db/mongo';
import log from './utils/logger';

const PID = process.pid;

process.on('unhandledRejection', err => {
  log.error('[PID=%d] unhandledRejection: %s', PID, err.message);
});

async function init() {
  try {
    await waitUntilMongoIsAlive(1000 * 60 * 8);
    await connectToMongoDb();

    const server = http.createServer(app.callback());

    server.listen(serverConfig.port, () => log.info('[PID=%d] Server run at port %d', PID, serverConfig.port));
    server.on('error', err => log.error('[PID=%d] Server failed with error: %s', PID, err));
  } catch (err) {
    log.error('[PID=%d] On start error: %s', PID, err.message);
  }
}

init().catch();
