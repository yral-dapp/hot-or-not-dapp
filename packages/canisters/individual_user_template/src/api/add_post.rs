use crate::{internal::model::post::Post, AccessControlMap, AllCreatedPosts};
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::{
    access_control::{self, UserAccessRole},
    shared_types::post::PostDetailsFromFrontend,
};

/// # Access Control
/// Only the user whose profile details are stored in this canister can create a post.
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn add_post(post_details: PostDetailsFromFrontend) -> u64 {
    // * access control
    let user_id_access_control_map: AccessControlMap = s!(AccessControlMap);
    assert!(access_control::does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::ProfileOwner,
        SPrincipal(ic_cdk::caller())
    ));

    let mut all_posts_mut: AllCreatedPosts = s!(AllCreatedPosts);
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
