import Router from 'koa-router';

import profileRoutes from '../api/modules/profiles/routes';
import formatJSONResponse from '../middlewares/responseFormatters/json';

const router = new Router();

router.use(formatJSONResponse);
router.use('/profiles', profileRoutes);

export default router.routes();
