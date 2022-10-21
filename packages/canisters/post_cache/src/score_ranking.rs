use crate::PostsIndexSortedByScore;
use ic_stable_memory::s;
use shared_utils::shared_types::top_posts::v0::PostScoreIndexItem;

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
pub fn receive_top_posts_from_publishing_canister(
    top_posts_from_publishing_canister: Vec<PostScoreIndexItem>,
) {
    // TODO: Add access control to allow only project canisters to send this message

    let mut posts_index_sorted_by_score = s!(PostsIndexSortedByScore);

    for post_score_index_item in top_posts_from_publishing_canister {
        posts_index_sorted_by_score.replace(post_score_index_item);
    }

    if posts_index_sorted_by_score.len() > 1500 {
        posts_index_sorted_by_score = posts_index_sorted_by_score.into_iter().take(1000).collect();
    }

    s! { PostsIndexSortedByScore = posts_index_sorted_by_score };
}
