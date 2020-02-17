import HTTPErrors from 'http-custom-errors';

import _ from 'lodash';
import log from '../../../../utils/logger';
import searchProfilesHandler from '../handlers/searchProfiles';

const SEARCH_LIMIT = 10;

export default async ctx => {
  try {
    const searchArgs = _.pick(ctx.query, ['distributorId', 'email', 'fullName', 'country']);
    const useExplain = !!ctx.query.explain;

    const profiles = await searchProfilesHandler(searchArgs, { limit: SEARCH_LIMIT, explain: useExplain });

    ctx.state.result = {
      code: 200,
      data: {
        // Returns a search result or query explanation
        // https://docs.mongodb.com/manual/reference/method/cursor.explain/
        [useExplain ? 'explain' : 'profiles']: useExplain ? profiles[0] : profiles,
        searchArgs
      }
    };
  } catch (e) {
    log.error(e);

    throw HTTPErrors.InternalServerError(`Unable to search. ${e.message}`);
  }
};
