import Profile from '../../../models/Profile';

export default async ({ email, fullName, country, distributorId }, { limit = 10, explain = false }) => {
  const searchArgs = Object.create(null);

  if (distributorId) {
    searchArgs.distributorId = distributorId;
  }

  if (country) {
    searchArgs.country = country;
  }

  if (email) {
    searchArgs.email = { $regex: email, $options: 'i' };
  }

  if (fullName) {
    searchArgs.fullName = { $regex: fullName, $options: 'i' };
  }

  let searchPromise = Profile.find(searchArgs).limit(limit);

  if (explain) {
    searchPromise = searchPromise.setOptions({ explain: 'executionStats' });
  }

  return searchPromise;
};
