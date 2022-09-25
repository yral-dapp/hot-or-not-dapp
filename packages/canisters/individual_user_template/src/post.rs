use crate::{
    AccessControlMap, AllCreatedPosts, PrincipalsIFollow, PrincipalsThatFollowMe, Profile,
};
use candid::{CandidType, Principal};
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use internal::{
    Post, PostDetailsForFrontend, PostDetailsFromFrontend, PostStatus, PostViewDetailsFromFrontend,
};
use shared_utils::{
    access_control::{does_principal_have_role, UserAccessRole},
    pagination::{self, PaginationError},
};

pub mod internal;

/// # Access Control
/// Only the user whose profile details are stored in this canister can create a post.
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn add_post(post_details: PostDetailsFromFrontend) -> u64 {
    // * access control
    let user_id_access_control_map = s!(AccessControlMap);
    assert!(does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::ProfileOwner,
        SPrincipal(ic_cdk::caller())
    ));

    let mut all_posts_mut = s!(AllCreatedPosts);
    let id = all_posts_mut.len();

    let post = Post::new(
        id,
        post_details.description,
        post_details.hashtags,
        post_details.video_uid,
        post_details.creator_consent_for_inclusion_in_hot_or_not,
    );

    all_posts_mut.push(&post);

    s! { AllCreatedPosts = all_posts_mut };

    id
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_post_add_view_details(id: u64, details: PostViewDetailsFromFrontend) {
    let mut all_posts_mut = s!(AllCreatedPosts);

    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();

    post_to_update.add_view_details(details);
    all_posts_mut.replace(id, &post_to_update);

    s! { AllCreatedPosts = all_posts_mut };
}

/// # Access Control
/// Only admin principals allowed
/// To only be called from a trusted env like a cloud function
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_post_as_ready_to_view(id: u64) {
    // * access control
    let user_id_access_control_map = s!(AccessControlMap);
    assert!(does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::CanisterAdmin,
        SPrincipal(ic_cdk::caller())
    ));

    let mut all_posts_mut = s!(AllCreatedPosts);
    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();
    post_to_update.update_status(PostStatus::ReadyToView);
    all_posts_mut.replace(id, &post_to_update);
    s! { AllCreatedPosts = all_posts_mut };
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_post_increment_share_count(id: u64) -> u64 {
    let mut all_posts_mut = s!(AllCreatedPosts);
    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();

    let updated_share_count = post_to_update.increment_share_count();
    all_posts_mut.replace(id, &post_to_update);
    s! { AllCreatedPosts = all_posts_mut };
    updated_share_count
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_post_toggle_like_status_by_caller(id: u64) -> bool {
    let caller_id = SPrincipal(ic_cdk::caller());

    let mut all_posts_mut = s!(AllCreatedPosts);
    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();

    let updated_like_status = post_to_update.toggle_like_status(&caller_id);
    all_posts_mut.replace(id, &post_to_update);
    s! { AllCreatedPosts = all_posts_mut };

    updated_like_status
}

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
    let all_posts = s!(AllCreatedPosts);

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

    let user_profile = s!(Profile);

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

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
pub fn get_individual_post_details_by_id(post_id: u64) -> PostDetailsForFrontend {
    let all_posts = s!(AllCreatedPosts);
    let user_profile = s!(Profile);

    all_posts
        .get_cloned(post_id)
        .unwrap()
        .get_post_details_for_frontend_for_this_post(
            user_profile.get_user_profile_details_for_frontend(),
            SPrincipal(ic_cdk::caller()),
        )
}

#[derive(CandidType)]
pub enum GetFollowerOrFollowingError {
    InvalidBoundsPassed,
    ReachedEndOfItemsList,
    ExceededMaxNumberOfItemsAllowedInOneRequest,
}

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
pub fn get_principals_i_follow_paginated(
    from_inclusive_index: u64,
    to_exclusive_index: u64,
) -> Result<Vec<Principal>, GetFollowerOrFollowingError> {
    let principals_i_follow = s!(PrincipalsIFollow);

    let (from_inclusive_index, to_exclusive_index) = pagination::get_pagination_bounds(
        from_inclusive_index,
        to_exclusive_index,
        principals_i_follow.len() as u64,
    )
    .map_err(|e| match e {
        PaginationError::InvalidBoundsPassed => GetFollowerOrFollowingError::InvalidBoundsPassed,
        PaginationError::ReachedEndOfItemsList => {
            GetFollowerOrFollowingError::ReachedEndOfItemsList
        }
        PaginationError::ExceededMaxNumberOfItemsAllowedInOneRequest => {
            GetFollowerOrFollowingError::ExceededMaxNumberOfItemsAllowedInOneRequest
        }
    })?;

    Ok(principals_i_follow
        .iter()
        .skip(from_inclusive_index as usize)
        .take(to_exclusive_index as usize)
        .map(|sprincipal| sprincipal.0)
        .collect())
}

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
pub fn get_principals_that_follow_me_paginated(
    from_inclusive_index: u64,
    to_exclusive_index: u64,
) -> Result<Vec<Principal>, GetFollowerOrFollowingError> {
    let principals_that_follow_me = s!(PrincipalsThatFollowMe);

    let (from_inclusive_index, to_exclusive_index) = pagination::get_pagination_bounds(
        from_inclusive_index,
        to_exclusive_index,
        principals_that_follow_me.len() as u64,
    )
    .map_err(|e| match e {
        PaginationError::InvalidBoundsPassed => GetFollowerOrFollowingError::InvalidBoundsPassed,
        PaginationError::ReachedEndOfItemsList => {
            GetFollowerOrFollowingError::ReachedEndOfItemsList
        }
        PaginationError::ExceededMaxNumberOfItemsAllowedInOneRequest => {
            GetFollowerOrFollowingError::ExceededMaxNumberOfItemsAllowedInOneRequest
        }
    })?;

    Ok(principals_that_follow_me
        .iter()
        .skip(from_inclusive_index as usize)
        .take(to_exclusive_index as usize)
        .map(|sprincipal| sprincipal.0)
        .collect())
}
