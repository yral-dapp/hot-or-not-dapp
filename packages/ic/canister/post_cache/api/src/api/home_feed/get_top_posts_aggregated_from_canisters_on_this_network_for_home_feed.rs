use crate::PostsIndexSortedByHomeFeedScore;
use ic_stable_memory::s;
use shared_utils::{
    pagination::{self, PaginationError},
    types::{
        canister_specific::post_cache::error_types::TopPostsFetchError,
        top_posts::v0::PostScoreIndexItem,
    },
};

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_top_posts_aggregated_from_canisters_on_this_network_for_home_feed(
    from_inclusive_index: u64,
    to_exclusive_index: u64,
) -> Result<Vec<PostScoreIndexItem>, TopPostsFetchError> {
    let posts_index_sorted_by_home_feed_score: PostsIndexSortedByHomeFeedScore =
        s!(PostsIndexSortedByHomeFeedScore);

    let (from_inclusive_index, to_exclusive_index) = pagination::get_pagination_bounds(
        from_inclusive_index,
        to_exclusive_index,
        posts_index_sorted_by_home_feed_score.iter().count() as u64,
    )
    .map_err(|e| match e {
        PaginationError::InvalidBoundsPassed => TopPostsFetchError::InvalidBoundsPassed,
        PaginationError::ReachedEndOfItemsList => TopPostsFetchError::ReachedEndOfItemsList,
        PaginationError::ExceededMaxNumberOfItemsAllowedInOneRequest => {
            TopPostsFetchError::ExceededMaxNumberOfItemsAllowedInOneRequest
        }
    })?;

    Ok(posts_index_sorted_by_home_feed_score
        .iter()
        .skip(from_inclusive_index as usize)
        .take(to_exclusive_index as usize)
        .cloned()
        .collect())
}
