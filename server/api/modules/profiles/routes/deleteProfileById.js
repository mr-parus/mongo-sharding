import HTTPErrors from 'http-custom-errors';

import WrongArgumentError from '../../../../utils/errors/WrongArgumentsError';
import log from '../../../../utils/logger';
import deleteProfileByIdHandler from '../handlers/deleteProfileById';

export default async ctx => {
  try {
    const { id } = ctx.params;

    const result = await deleteProfileByIdHandler(id);

    ctx.state.result = {
      code: 200,
      data: {
        type: 'profile',
        result,
        message: `Instance with id = ${id} is ${result ? '' : 'not'} deleted`
      }
    };
  } catch (e) {
    if (e instanceof WrongArgumentError) {
      throw new HTTPErrors.BadRequestError(`No profiles with such id = ${e.argValue}`);
    }

    log.error(e);

    throw HTTPErrors.InternalServerError(`Unable to delete. ${e.message}`);
  }
};
