import chai from 'chai';
import _ from 'lodash';
import mongoose from 'mongoose';
import supertest from 'supertest';

import { app } from '../app';
import { connect as connectToMongoDb } from '../utils/db/mongo';
import mockProfileData from './helpers/mockProfileData';

const { expect } = chai;

let request;
const mockProfiles = mockProfileData();

before(async () => {
  await connectToMongoDb();
  request = supertest(app.listen());
});

afterEach(() => mockProfiles.deleteCreated());

describe('All requests reach corresponding shard', () => {
  /*
   Imagine we have several MongoDB shards located in different continents.
   As it could be seen from the docker-compose and .env files:

   shard1
   ZONE NA (North America)
   country: "US", distributorId: from 1   to 100
   country: "CA", distributorId: from 101 to 200

   shard2
   ZONE EU (European Union)
   country: "EE", distributorId: from 201 to 300
   country: "FI", distributorId: from 301 to 400

   Sharding key: {country: 1, distributorId: 1}
   */

  const getInvolvedShardNamesInSearch = async query => {
    const result = await request
      .get('/api/profiles/search')
      .query({ ...query, explain: true })
      .expect(200);

    const shardsData = _.get(result, 'body.data.explain.queryPlanner.winningPlan.shards', []);
    return shardsData.map(({ shardName }) => shardName);
  };

  const testDataSet = [
    { involvedShards: ['shard1'], query: { country: 'US', distributorId: 50 } },
    { involvedShards: ['shard1'], query: { country: 'CA', distributorId: 122 } },
    { involvedShards: ['shard2'], query: { country: 'EE', distributorId: 250 } },
    { involvedShards: ['shard2'], query: { country: 'FI', distributorId: 320 } },
    { involvedShards: ['shard1', 'shard2'], query: {} }
  ];

  it('should search in a proper shard', async () => {
    await Promise.all(
      testDataSet.map(async ({ query, involvedShards }) => {
        const shardNames = await getInvolvedShardNamesInSearch(query);
        expect(shardNames.sort()).be.eql(involvedShards.sort());
      })
    );
  });
});

describe('Storing Profiles', () => {
  it('should store a Profile', async () => {
    const profile = mockProfiles.generateProfileData();

    const { body } = await request
      .post('/api/profiles/')
      .send(profile)
      .expect(201);

    expect(body.data.profile.email).to.be.eq(profile.email.toLowerCase());
    expect(body.data.profile.fullName).to.be.eq(profile.fullName);

    const instanceId = body.data.profile.id;

    // eslint-disable-next-line no-unused-expressions
    expect(mongoose.Types.ObjectId.isValid(instanceId)).to.be.true;

    mockProfiles.adIds(instanceId);
  });
});

describe('Retrieving Profiles', () => {
  let profile;

  before(async () => {
    profile = await mockProfiles.insertN(1);
  });

  it('should get a Profile', async () => {
    const { body } = await request.get(`/api/profiles/${profile.id}`).expect(200);

    expect(body.data.profile.email).to.be.eq(profile.email.toLowerCase());
    expect(body.data.profile.fullName).to.be.eq(profile.fullName);
    // eslint-disable-next-line no-unused-expressions
    expect(mongoose.Types.ObjectId.isValid(body.data.profile.id)).to.be.true;
  });
});

describe('Deleting Profiles', () => {
  let insertedProfileIds = [];

  before(async () => {
    const insertedData = await mockProfiles.insertN(10);
    insertedProfileIds = insertedData.map(i => i._id);
  });

  it('should delete several Profiles', async () => {
    const makeDeleteReq = id => request.delete(`/api/profiles/${id}`).expect(200);
    const makeGetReq = (id, status) => request.get(`/api/profiles/${id}`).expect(status);

    await Promise.all(insertedProfileIds.map(id => makeGetReq(id, 200)));
    await Promise.all(insertedProfileIds.map(makeDeleteReq));
    await Promise.all(insertedProfileIds.map(id => makeGetReq(id, 404)));
  });
});
