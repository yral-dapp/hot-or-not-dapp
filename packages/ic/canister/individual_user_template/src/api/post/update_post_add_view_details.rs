use ic_stable_memory::s;
use shared_utils::{
    canister_specific::individual_user_template::types::post::v0::PostViewDetailsFromFrontend,
    date_time::system_time,
};

use crate::data_model::AllCreatedPostsV1;

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_post_add_view_details(id: u64, details: PostViewDetailsFromFrontend) {
    let mut all_posts_mut = s!(AllCreatedPostsV1);

    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();

    post_to_update.add_view_details(details, &system_time::get_current_system_time_from_ic);
    all_posts_mut.replace(id, &post_to_update);

    s! { AllCreatedPostsV1 = all_posts_mut };
}
