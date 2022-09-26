import type { PostDetailsForFrontend } from '$canisters/individual_user_template/individual_user_template.did';
import type { PostScoreIndexItem, TopPostsFetchError } from '$canisters/post_cache/post_cache.did';
import Log from '$lib/utils/Log';
import { Principal } from '@dfinity/principal';

export interface PostPopulated extends PostScoreIndexItem, PostDetailsForFrontend {}

export type FeedResponse =
	| {
			posts: PostPopulated[];
			error: false;
			noMorePosts: boolean;
	  }
	| {
			error: true;
	  }
	| {
			error: false;
			noMorePosts: true;
	  };

export async function getTopPosts(from: number) {
	try {
		const { postCache } = await import('./backend');
		const res = await postCache().get_top_posts_aggregated_from_canisters_on_this_network(
			BigInt(from),
			BigInt(from + 10)
		);
		Log({ res, from: '0 getTopPosts' }, 'info');
		if ('Ok' in res) {
			return {
				error: false,
				posts: res.Ok,
				noMorePosts: res.Ok.length < 10
			};
		} else if ('Err' in res) {
			type UnionKeyOf<U> = U extends U ? keyof U : never;
			type errors = UnionKeyOf<TopPostsFetchError>;
			const err = Object.keys(res.Err)[0] as errors;
			switch (err) {
				case 'InvalidBoundsPassed':
				case 'ExceededMaxNumberOfItemsAllowedInOneRequest':
					return { error: true, posts: [] };
				case 'ReachedEndOfItemsList':
					return { error: false, noMorePosts: true };
			}
		} else throw new Error(`Unknown response, ${JSON.stringify(res)}`);
	} catch (e) {
		Log({ error: e, from: '11 getTopPosts' }, 'error');
		return { error: true, posts: [] };
	}
}

export async function populatePosts(posts: PostScoreIndexItem[]): Promise<PostPopulated[] | false> {
	try {
		const { individualUser } = await import('./backend');

		const res = await Promise.all(
			posts.map((post) =>
				individualUser(
					Principal.from(post.publisher_canister_id)
				).get_individual_post_details_by_id(post.post_id)
			)
		);

		console.log('res', res);

		const populatePosts: PostPopulated[] = [];

		// res.forEach(())
		return populatePosts;
	} catch (e) {
		Log({ error: e, from: '11 populatePosts' }, 'error');
		return false;
	}
}
