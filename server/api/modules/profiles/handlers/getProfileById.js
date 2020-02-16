import mongoose from 'mongoose';

import WrongArgumentError from '../../../../utils/errors/WrongArgumentsError';
import { catchSync } from '../../../../utils/helpers';
import Profile from '../../../models/Profile';

export default async id => {
  const [err, objectId] = catchSync(mongoose.Types.ObjectId, id);

  if (err) {
    throw new WrongArgumentError('id', id);
  }

  const profile = await Profile.findById(objectId);
  if (!profile) {
    throw new WrongArgumentError('id', id);
  }

  return profile;
};
