import HTTPErrors from 'http-custom-errors';

import WrongArgumentError from '../../../../utils/errors/WrongArgumentsError';
import log from '../../../../utils/logger';
import getProfileByIdHandler from '../handlers/getProfileById';

export default async ctx => {
  try {
    const { id } = ctx.params;

    const profile = await getProfileByIdHandler(id);

    ctx.state.result = {
      code: 200,
      data: {
        profile,
        type: 'profile'
      }
    };
  } catch (e) {
    if (e instanceof WrongArgumentError) {
      throw new HTTPErrors.NotFoundError(`No profiles with such id = ${e.argValue}`);
    }

    log.error(e);

    throw HTTPErrors.InternalServerError(`Unable to get instance. ${e.message}`);
  }
};
