import getProfileById from './getProfileById';

export default async id => {
  const profile = await getProfileById(id);

  // This logic should better run inside the transaction
  // because something like 'dirty read' https://en.wikipedia.org/wiki/Isolation_(database_systems)
  // could happen between 'findById' and 'remove'

  await profile.remove();
  return true;
};
