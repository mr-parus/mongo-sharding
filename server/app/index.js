import cors from 'kcors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaLogger from 'koa-logger';
import responseTime from 'koa-response-time';
import router from '../routes/router';
import log from '../utils/logger';

export const app = new Koa();

app
  .use(responseTime())
  .use(koaLogger(log.info))
  .use(cors())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(ctx => {
    ctx.body = 'Hello word!';
  })
  .on('error', err => log.error('Error occurred: %s', err.message));
