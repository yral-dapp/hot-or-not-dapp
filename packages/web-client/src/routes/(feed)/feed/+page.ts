export const ssr = false;
import { redirect } from '@sveltejs/kit';

export async function load() {
	const { postCache } = await import('$lib/helpers/backend');
	const res = await postCache().get_top_posts_aggregated_from_canisters_on_this_network(
		BigInt(0),
		BigInt(1)
	);
	if ('Ok' in res && res.Ok[0]) {
		throw redirect(307, `/feed/${res.Ok[0].publisher_canister_id.toText()}@${res.Ok[0].post_id}`);
	} else {
		throw redirect(307, '/feed/no-videos');
	}
}
