use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use individual_user_template_lib::{model::post::v1::Post, AccessControlMap, AllCreatedPostsV1};
use shared_utils::{
    access_control::{self, UserAccessRole},
    date_time::system_time,
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

    let mut all_posts_mut: AllCreatedPostsV1 = s!(AllCreatedPostsV1);
    let id = all_posts_mut.len();

    let mut post = Post::new(
        id,
        post_details,
        &system_time::get_current_system_time_from_ic,
    );

    post.recalculate_home_feed_score(&system_time::get_current_system_time_from_ic);
    post.recalculate_hot_or_not_feed_score(&system_time::get_current_system_time_from_ic);

    all_posts_mut.push(&post);

    s! { AllCreatedPostsV1 = all_posts_mut };

    id
}
