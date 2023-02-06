use crate::data_model::AllCreatedPostsV1;
use ic_stable_memory::s;
use shared_utils::date_time::system_time;

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_post_increment_share_count(id: u64) -> u64 {
    let mut all_posts: AllCreatedPostsV1 = s!(AllCreatedPostsV1);
    let mut post_to_update = all_posts.get_cloned(id).unwrap();

    let updated_share_count =
        post_to_update.increment_share_count(&system_time::get_current_system_time_from_ic);
    all_posts.replace(id, &post_to_update);
    s! { AllCreatedPostsV1 = all_posts };

    updated_share_count
}
