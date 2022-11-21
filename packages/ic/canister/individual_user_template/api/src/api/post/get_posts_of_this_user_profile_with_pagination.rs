use candid::CandidType;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use individual_user_template_lib::{AllCreatedPosts, Profile};
use shared_utils::{
    pagination::{self, PaginationError},
    shared_types::individual_user_template::post::PostDetailsForFrontend,
};

#[derive(CandidType)]
pub enum GetPostsOfUserProfileError {
    InvalidBoundsPassed,
    ReachedEndOfItemsList,
    ExceededMaxNumberOfItemsAllowedInOneRequest,
}

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_posts_of_this_user_profile_with_pagination(
    from_inclusive_id: u64,
    to_exclusive_id: u64,
) -> Result<Vec<PostDetailsForFrontend>, GetPostsOfUserProfileError> {
    let all_posts: AllCreatedPosts = s!(AllCreatedPosts);

    let (from_inclusive_id, to_exclusive_id) =
        pagination::get_pagination_bounds(from_inclusive_id, to_exclusive_id, all_posts.len())
            .map_err(|e| match e {
                PaginationError::InvalidBoundsPassed => {
                    GetPostsOfUserProfileError::InvalidBoundsPassed
                }
                PaginationError::ReachedEndOfItemsList => {
                    GetPostsOfUserProfileError::ReachedEndOfItemsList
                }
                PaginationError::ExceededMaxNumberOfItemsAllowedInOneRequest => {
                    GetPostsOfUserProfileError::ExceededMaxNumberOfItemsAllowedInOneRequest
                }
            })?;

    let user_profile: Profile = s!(Profile);

    Ok((from_inclusive_id..to_exclusive_id)
        .map(|id| {
            all_posts
                .get_cloned(id)
                .unwrap()
                .get_post_details_for_frontend_for_this_post(
                    user_profile.get_user_profile_details_for_frontend(),
                    SPrincipal(ic_cdk::caller()),
                )
        })
        .collect())
}
