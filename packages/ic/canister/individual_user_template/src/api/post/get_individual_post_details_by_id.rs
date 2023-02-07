use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::types::canister_specific::individual_user_template::post::PostDetailsForFrontend;

use crate::data_model::{AllCreatedPostsV1, Profile};

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
pub fn get_individual_post_details_by_id(post_id: u64) -> PostDetailsForFrontend {
    let all_posts = s!(AllCreatedPostsV1);
    let user_profile = s!(Profile);

    all_posts
        .get_cloned(post_id)
        .unwrap()
        .get_post_details_for_frontend_for_this_post(
            user_profile.get_user_profile_details_for_frontend(),
            SPrincipal(ic_cdk::caller()),
        )
}
