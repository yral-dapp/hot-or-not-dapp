export const ssr = false;
import { redirect } from '@sveltejs/kit';

export async function load() {
	const { getTopPosts } = await import('$lib/helpers/feed');
	const res = await getTopPosts(0, 1);
	if (res.error || !res.posts[0]) {
		throw redirect(307, '/feed/no-videos');
	}
	throw redirect(307, `/feed/${res.posts[0].publisher_canister_id}:${res.posts[0].post_id}`);
}
