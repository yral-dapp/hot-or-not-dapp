export const ssr = false;
import { Principal } from '@dfinity/principal';
import type { PageLoad } from './$types';
import type { PostPopulated } from '$lib/helpers/feed';
import { individualUser } from '$lib/helpers/backend';

export const load: PageLoad = async ({ params, fetch }) => {
	const id = params.id.split('@');
	const postId = BigInt(Number(id[1]));
	const principal = Principal.from(id[0]);

	const r = await individualUser(principal, fetch).get_individual_post_details_by_id(postId);

	if (r.video_uid && r.hot_or_not_feed_ranking_score[0] !== undefined) {
		return {
			post: {
				...r,
				publisher_canister_id: id[0],
				created_by_user_principal_id: r.created_by_user_principal_id.toText(),
				post_id: postId,
				score: BigInt(0)
			} as PostPopulated
		};
	} else {
		return {
			post: undefined
		};
	}
};
