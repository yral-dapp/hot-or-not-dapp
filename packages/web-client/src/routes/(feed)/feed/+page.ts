import { getTopPosts } from '$lib/helpers/feed';
import { redirect } from '@sveltejs/kit';

export async function load() {
	const res = await getTopPosts(0, 1);
	console.log('res', res);
	if (res.error || !res.posts[0]) {
		throw redirect(307, '/feed/invalid-video');
	}
	throw redirect(307, `/feed/${res.posts[0].publisher_canister_id}:${res.posts[0].post_id}`);
	// throw redirect(307, '/feed/1');
}
