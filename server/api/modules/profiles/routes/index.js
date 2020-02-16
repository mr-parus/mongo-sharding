import Router from 'koa-router';

import createNewRoute from './createProfile';
import deleteByIdRoute from './deleteProfileById';
import getByIdRoute from './getProfileByIdRoute';
import searchRoute from './searchProfiles';

const router = new Router();

router.delete('/:id', deleteByIdRoute);
router.get('/search', searchRoute);
router.get('/:id', getByIdRoute);
router.post('/', createNewRoute);

export default router.routes();
