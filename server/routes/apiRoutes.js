import Router from 'koa-router';
import formatJSONResponse from '../middlewares/responseFormatters/json';

const router = new Router();

router.use(formatJSONResponse);

export default router.routes();
