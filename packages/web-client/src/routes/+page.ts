export const ssr = false;

import { getWatchedVideosFromCache } from '$lib/helpers/feed';
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ url }) => {
	let searchParams = url.searchParams.toString();
	if (searchParams) {
		searchParams = `?${searchParams}`;
	}
	const cachedVideos = await getWatchedVideosFromCache();
	if (cachedVideos.length) {
		throw redirect(
			307,
			`/feed/${cachedVideos[0].publisher_canister_id}@${cachedVideos[0].post_id}`
		);
	}

	const { postCache } = await import('$lib/helpers/backend');
	const res = await postCache().get_top_posts_aggregated_from_canisters_on_this_network(
		BigInt(0),
		BigInt(1)
	);

	if ('Ok' in res && res.Ok[0]) {
		throw redirect(
			307,
			`/feed/${res.Ok[0].publisher_canister_id.toText()}@${res.Ok[0].post_id}${searchParams}`
		);
	} else {
		throw redirect(307, `/feed/no-videos${searchParams}`);
	}
};
