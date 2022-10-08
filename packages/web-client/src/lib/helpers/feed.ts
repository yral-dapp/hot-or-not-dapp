import type { PostDetailsForFrontend } from '$canisters/individual_user_template/individual_user_template.did';
import type { PostScoreIndexItem, TopPostsFetchError } from '$canisters/post_cache/post_cache.did';
import Log from '$lib/utils/Log';
import { Principal } from '@dfinity/principal';

export interface PostPopulated
	extends PostScoreIndexItem,
		Omit<PostDetailsForFrontend, 'created_by_user_principal_id'> {
	created_by_user_principal_id: string;
}

export type FeedResponse =
	| {
			posts: PostPopulated[];
			error: false;
			noMorePosts: boolean;
	  }
	| {
			error: true;
	  };
export async function getTopPosts(from: number, numberOfPosts: number = 10): Promise<FeedResponse> {
	try {
		const { postCache } = await import('./backend');
		const res = await postCache().get_top_posts_aggregated_from_canisters_on_this_network(
			BigInt(from),
			BigInt(from + numberOfPosts)
		);
		Log({ res, from: '0 getTopPosts' }, 'info');
		if ('Ok' in res) {
			const populatedRes = await populatePosts(res.Ok);
			if (populatedRes.error) {
				throw new Error(`Error while populating, ${JSON.stringify(populatedRes)}`);
			}
			return {
				error: false,
				posts: populatedRes.posts,
				noMorePosts: res.Ok.length < numberOfPosts
			};
		} else if ('Err' in res) {
			type UnionKeyOf<U> = U extends U ? keyof U : never;
			type errors = UnionKeyOf<TopPostsFetchError>;
			const err = Object.keys(res.Err)[0] as errors;
			switch (err) {
				case 'InvalidBoundsPassed':
				case 'ExceededMaxNumberOfItemsAllowedInOneRequest':
					return { error: true };
				case 'ReachedEndOfItemsList':
					return { error: false, noMorePosts: true, posts: [] };
			}
		} else throw new Error(`Unknown response, ${JSON.stringify(res)}`);
	} catch (e) {
		Log({ error: e, from: '11 getTopPosts' }, 'error');
		return { error: true };
	}
}

async function populatePosts(posts: PostScoreIndexItem[]) {
	try {
		const { individualUser } = await import('./backend');

		const res = await Promise.all(
			posts.map(async (post) => {
				const r = await individualUser(
					Principal.from(post.publisher_canister_id)
				).get_individual_post_details_by_id(post.post_id);
				return { ...r, ...post, created_by_user_principal_id: post.publisher_canister_id.toText() };
			})
		);

		return { posts: res as PostPopulated[], error: false };
	} catch (e) {
		Log({ error: e, from: '11 populatePosts' }, 'error');
		return { error: true, posts: [] };
	}
}
