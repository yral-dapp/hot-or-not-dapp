export const ssr = false

import { redirect } from '@sveltejs/kit'

throw redirect(307, '/hotornot')
