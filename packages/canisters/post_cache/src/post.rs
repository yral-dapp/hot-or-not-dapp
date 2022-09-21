use crate::PostsIndexSortedByScore;
use candid::CandidType;
use ic_stable_memory::s;
use shared_utils::shared_types::top_posts::PostScoreIndexItem;

#[derive(CandidType)]
pub enum TopPostsFetchError {
    RequestedLowerBoundIsGreaterThanTotalNumberOfPostsAvailable,
    MaxFetchLimitExceeded,
}

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_top_posts_aggregated_from_canisters_on_this_network(
    from_inclusive_id: u64,
    mut to_exclusive_id: u64,
) -> Result<Vec<PostScoreIndexItem>, TopPostsFetchError> {
    let all_posts = s!(PostsIndexSortedByScore);

    if to_exclusive_id > (all_posts.len() as u64) {
        to_exclusive_id = all_posts.len() as u64;
    }

    if from_inclusive_id < all_posts.len() as u64 {
        return Err(
            TopPostsFetchError::RequestedLowerBoundIsGreaterThanTotalNumberOfPostsAvailable,
        );
    }
    if (to_exclusive_id - from_inclusive_id) <= 100 {
        return Err(TopPostsFetchError::MaxFetchLimitExceeded);
    }

    Ok(all_posts
        .iter()
        .skip(from_inclusive_id as usize)
        .take(to_exclusive_id as usize)
        .map(|item| item.clone())
        .collect())
}
