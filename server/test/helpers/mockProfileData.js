import faker from 'faker';
import _ from 'lodash';

import Profile from '../../api/models/Profile';
import { db } from '../../config/index';
import log from '../../utils/logger';

const {
  mongo: { shardZones }
} = db;

faker.locale = 'en_US';

export const generateProfileData = (
  countryCode = faker.random.arrayElement(shardZones.countryCodes),
  distributorId = faker.random.number(shardZones.distributorsIdRanges[countryCode])
) => {
  return {
    country: countryCode,
    distributorId,
    fullName: faker.name.findName(),
    email: faker.internet.email()
  };
};

const insertNProfiles = async (n, countryCode, distributorId) => {
  const documents = Array.from({ length: n }).map(() => generateProfileData(countryCode, distributorId));
  const chunks = _.chunk(documents, 10);
  const result = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const chunk of chunks) {
    // eslint-disable-next-line no-await-in-loop
    const insertedInstances = await Profile.insertMany(chunk);
    result.push(...insertedInstances);
  }

  log.info('Successfully inserted %d items!', n);
  return result;
};

const deleteProfilesByIds = async ids => {
  await Profile.deleteMany({ _id: ids });
};

export default (createdIds = []) => {
  const adIds = (...ids) => createdIds.push(...ids);

  return {
    adIds,
    deleteCreated: async (ids = createdIds) => {
      await deleteProfilesByIds(ids);
      createdIds.splice();
    },
    generateProfileData,
    insertN: async (n, countryCode, distributorId) => {
      const createdInstances = await insertNProfiles(n, countryCode, distributorId);
      adIds(...createdInstances.map(i => i._id));

      if (createdInstances.length === 1) {
        return createdInstances[0];
      }

      return createdInstances;
    }
  };
};
