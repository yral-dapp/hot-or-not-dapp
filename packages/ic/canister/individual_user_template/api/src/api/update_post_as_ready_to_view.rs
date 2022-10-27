use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use individual_user_template_lib::{model::post::PostStatus, AccessControlMap, AllCreatedPosts};
use shared_utils::access_control::{self, UserAccessRole};

/// # Access Control
/// Only admin principals allowed
/// To only be called from a trusted env like a cloud function
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_post_as_ready_to_view(id: u64) {
    // * access control
    let user_id_access_control_map: AccessControlMap = s!(AccessControlMap);
    assert!(access_control::does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::CanisterAdmin,
        SPrincipal(ic_cdk::caller())
    ));

    let mut all_posts_mut: AllCreatedPosts = s!(AllCreatedPosts);
    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();
    post_to_update.update_status(PostStatus::ReadyToView);
    all_posts_mut.replace(id, &post_to_update);
    s! { AllCreatedPosts = all_posts_mut };
}
