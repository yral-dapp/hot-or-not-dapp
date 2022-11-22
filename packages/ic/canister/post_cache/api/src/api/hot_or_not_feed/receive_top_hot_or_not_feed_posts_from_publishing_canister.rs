use ic_stable_memory::s;
use post_cache_lib::PostsIndexSortedByHotOrNotFeedScore;
use shared_utils::shared_types::top_posts::v0::PostScoreIndexItem;

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
pub fn receive_top_hot_or_not_feed_posts_from_publishing_canister(
    top_posts_from_publishing_canister: Vec<PostScoreIndexItem>,
) {
    // TODO: Add access control to allow only project canisters to send this message

    let mut posts_index_sorted_by_hot_or_not_feed_score: PostsIndexSortedByHotOrNotFeedScore =
        s!(PostsIndexSortedByHotOrNotFeedScore);

    for post_score_index_item in top_posts_from_publishing_canister {
        posts_index_sorted_by_hot_or_not_feed_score.replace(&post_score_index_item);
    }

    if posts_index_sorted_by_hot_or_not_feed_score.iter().count() > 1500 {
        posts_index_sorted_by_hot_or_not_feed_score = posts_index_sorted_by_hot_or_not_feed_score
            .into_iter()
            .take(100)
            .cloned()
            .collect();
    }

    s! { PostsIndexSortedByHotOrNotFeedScore = posts_index_sorted_by_hot_or_not_feed_score };
}
