import _ from 'lodash';
import prettyMs from 'pretty-ms';
import winston from 'winston';

import { logger as loggerConfig } from '../config';

Error.stackTraceLimit = 20;

const insertPath = () => {
  // This is not a production code. It just adds a clickable link to the log body:
  // file:///place/where/log/was/executed.js:13:48
  // Winston's author Charlie Robbins said it's ok
  return _.get(Error().stack.match(/file:\/{2}.*:\d+:\d+/g), '2', '');
};

const insertDuration = ms => (ms ? `(${ms && prettyMs(ms)}) ` : '');

const printF = info => {
  const { level, message, durationMs } = info;
  const path = insertPath();
  const duration = insertDuration(durationMs);
  return `[${level}] ${path} : ${duration}${message}`;
};

winston.configure({
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.printf(printF)
  ),
  level: loggerConfig.level,
  transports: [new winston.transports.Console()]
});

export default winston;
