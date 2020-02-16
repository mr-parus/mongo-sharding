import Profile from '../../../models/Profile';

export default async ({ country, distributorId, email, fullName }) => {
  const instance = new Profile({ country, distributorId, email, fullName });
  return instance.save();
};
