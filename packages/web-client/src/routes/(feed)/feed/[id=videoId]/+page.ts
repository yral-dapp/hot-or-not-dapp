export const ssr = false;
import { Principal } from '@dfinity/principal';
import type { PageLoad } from './$types';
import type { PostPopulated } from '$lib/helpers/feed';

export const load: PageLoad = async ({ params }) => {
	const id = params.id.split('@');
	const postId = BigInt(Number(id[1]));
	const principal = Principal.from(id[0]);

	const { individualUser } = await import('$lib/helpers/backend');

	const r = await individualUser(principal).get_individual_post_details_by_id(postId);

	if (r.video_uid) {
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
		return;
	}
};
