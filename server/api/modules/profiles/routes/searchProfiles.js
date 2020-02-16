import HTTPErrors from 'http-custom-errors';

import _ from 'lodash';
import log from '../../../../utils/logger';
import searchProfilesHandler from '../handlers/searchProfiles';

const SEARCH_LIMIT = 10;

export default async ctx => {
  try {
    const searchArgs = _.pick(ctx.query, ['distributorId', 'email', 'fullName', 'country']);

    const profiles = await searchProfilesHandler(searchArgs, SEARCH_LIMIT);

    ctx.state.result = {
      code: 200,
      data: {
        profiles,
        type: 'profile',
        limit: SEARCH_LIMIT,
        searchArgs,
        size: profiles.length
      }
    };
  } catch (e) {
    log.error(e);

    throw HTTPErrors.InternalServerError(`Unable to search. ${e.message}`);
  }
};
