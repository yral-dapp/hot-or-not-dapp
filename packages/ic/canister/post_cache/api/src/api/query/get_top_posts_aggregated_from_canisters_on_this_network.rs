use crate::PostsIndexSortedByScoreV1;
use ic_stable_memory::s;
use post_cache_lib::model::api_error::TopPostsFetchError;
use shared_utils::{
    pagination::{self, PaginationError},
    shared_types::top_posts::v0::PostScoreIndexItem,
};

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_top_posts_aggregated_from_canisters_on_this_network(
    from_inclusive_index: u64,
    to_exclusive_index: u64,
) -> Result<Vec<PostScoreIndexItem>, TopPostsFetchError> {
    let all_posts_v1: PostsIndexSortedByScoreV1 = s!(PostsIndexSortedByScoreV1);

    let (from_inclusive_index, to_exclusive_index) = pagination::get_pagination_bounds(
        from_inclusive_index,
        to_exclusive_index,
        all_posts_v1.iter().count() as u64,
    )
    .map_err(|e| match e {
        PaginationError::InvalidBoundsPassed => TopPostsFetchError::InvalidBoundsPassed,
        PaginationError::ReachedEndOfItemsList => TopPostsFetchError::ReachedEndOfItemsList,
        PaginationError::ExceededMaxNumberOfItemsAllowedInOneRequest => {
            TopPostsFetchError::ExceededMaxNumberOfItemsAllowedInOneRequest
        }
    })?;

    Ok(all_posts_v1
        .iter()
        .skip(from_inclusive_index as usize)
        .take(to_exclusive_index as usize)
        .cloned()
        .collect())
}
