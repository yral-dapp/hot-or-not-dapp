use crate::PostsIndexSortedByScore;
use candid::CandidType;
use ic_stable_memory::s;
use shared_utils::{
    pagination::{self, PaginationError},
    shared_types::top_posts::v1::PostScoreIndexItem,
};

#[derive(CandidType)]
pub enum TopPostsFetchError {
    InvalidBoundsPassed,
    ReachedEndOfItemsList,
    ExceededMaxNumberOfItemsAllowedInOneRequest,
}

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_top_posts_aggregated_from_canisters_on_this_network(
    from_inclusive_index: u64,
    to_exclusive_index: u64,
) -> Result<Vec<PostScoreIndexItem>, TopPostsFetchError> {
    let all_posts = s!(PostsIndexSortedByScore);

    let (from_inclusive_index, to_exclusive_index) = pagination::get_pagination_bounds(
        from_inclusive_index,
        to_exclusive_index,
        all_posts.len() as u64,
    )
    .map_err(|e| match e {
        PaginationError::InvalidBoundsPassed => TopPostsFetchError::InvalidBoundsPassed,
        PaginationError::ReachedEndOfItemsList => TopPostsFetchError::ReachedEndOfItemsList,
        PaginationError::ExceededMaxNumberOfItemsAllowedInOneRequest => {
            TopPostsFetchError::ExceededMaxNumberOfItemsAllowedInOneRequest
        }
    })?;

    Ok(all_posts
        .iter()
        .skip(from_inclusive_index as usize)
        .take(to_exclusive_index as usize)
        .map(|item| item.clone())
        .collect())
}
