export const ssr = true

import { redirect } from '@sveltejs/kit'
export const load = async () => {
  redirect(307, '/hotornot/')
}
