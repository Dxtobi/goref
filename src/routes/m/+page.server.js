import { MasterLink } from '$lib/server/db/models/index.js';
import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
  const { user } = await parent();
  
  if (!user) {
    throw redirect(302, '/');
  }
  const resentLinks = JSON.stringify(await MasterLink.find().lean().populate('creator', 'avatar username').sort({createdAt:-1}))
  
  return {
    resentLinks:JSON.parse(resentLinks)
  };
}