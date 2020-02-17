import HTTPErrors from 'http-custom-errors';
import WrongArgumentError from '../../../../utils/errors/WrongArgumentsError';
import log from '../../../../utils/logger';

import createNewHandler from '../handlers/createProfile';

export default async ctx => {
  const { country, distributorId, email, fullName } = ctx.request.body;

  try {
    // validations here
    // mdw which check req params, etc
    if (!country || !distributorId || !email || !fullName) {
      throw new WrongArgumentError('profile', ctx.request.body);
    }

    ctx.state.result = {
      data: {
        type: 'profile',
        profile: await createNewHandler({
          country,
          distributorId,
          email,
          fullName
        })
      },
      code: 201
    };
  } catch (e) {
    if (e.code && e.code === 11000) {
      throw HTTPErrors.ConflictError(`User with email "${email}" already exists.`);
    }

    if (e instanceof WrongArgumentError) {
      throw new HTTPErrors.BadRequestError();
    }

    log.error(e);

    // human-readable errors here, etc
    throw HTTPErrors.InternalServerError(`Unable to create. ${e.message}`);
  }
};
