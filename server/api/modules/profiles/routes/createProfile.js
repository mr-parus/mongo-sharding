import HTTPErrors from 'http-custom-errors';
import log from '../../../../utils/logger';

import createNewHandler from '../handlers/createProfile';

export default async ctx => {
  const { country, distributorId, email, fullName } = ctx.request.body;

  try {
    // validations here
    // mdw which check req params, etc

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
    log.error(e);
    if (e.code && e.code === 11000) {
      throw HTTPErrors.ConflictError(`User with email "${email}" already exists.`);
    }

    // human-readable errors here, etc
    throw HTTPErrors.InternalServerError(`Unable to create. ${e.message}`);
  }
};
