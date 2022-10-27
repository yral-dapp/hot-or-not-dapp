use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use individual_user_template_lib::{AccessControlMap, AllCreatedPosts};
use shared_utils::access_control::{self, UserAccessRole};

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_individual_post_score_by_id(post_id: u64) -> u64 {
    // * access control
    let user_id_access_control_map: AccessControlMap = s!(AccessControlMap);
    assert!(access_control::does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::ProfileOwner,
        SPrincipal(ic_cdk::caller())
    ));

    let all_posts: AllCreatedPosts = s!(AllCreatedPosts);

    all_posts.get_cloned(post_id).unwrap().get_post_score()
}
