use ic_stable_memory::s;
use post_cache_lib::{PostsIndexSortedByHomeFeedScore, PostsIndexSortedByScore};
use shared_utils::types::top_posts::v0::PostScoreIndexItem;

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
pub fn receive_top_home_feed_posts_from_publishing_canister(
    top_posts_from_publishing_canister: Vec<PostScoreIndexItem>,
) {
    // TODO: Add access control to allow only project canisters to send this message

    let mut posts_index_sorted_by_score: PostsIndexSortedByScore = s!(PostsIndexSortedByScore);
    let mut posts_index_sorted_by_home_feed_score: PostsIndexSortedByHomeFeedScore =
        s!(PostsIndexSortedByHomeFeedScore);

    for post_score_index_item in top_posts_from_publishing_canister {
        posts_index_sorted_by_score.replace(post_score_index_item.clone());
        posts_index_sorted_by_home_feed_score.replace(&post_score_index_item);
    }

    if posts_index_sorted_by_score.len() > 1500 {
        posts_index_sorted_by_score = posts_index_sorted_by_score.into_iter().take(1000).collect();
        posts_index_sorted_by_home_feed_score = posts_index_sorted_by_home_feed_score
            .into_iter()
            .take(100)
            .cloned()
            .collect();
    }

    s! { PostsIndexSortedByScore = posts_index_sorted_by_score };
    s! { PostsIndexSortedByHomeFeedScore = posts_index_sorted_by_home_feed_score };
}
