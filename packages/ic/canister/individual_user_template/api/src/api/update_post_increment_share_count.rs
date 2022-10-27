use crate::AllCreatedPosts;
use ic_stable_memory::s;

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_post_increment_share_count(id: u64) -> u64 {
    let mut all_posts: AllCreatedPosts = s!(AllCreatedPosts);
    let mut post_to_update = all_posts.get_cloned(id).unwrap();

    let updated_share_count = post_to_update.increment_share_count();
    all_posts.replace(id, &post_to_update);
    s! { AllCreatedPosts = all_posts };

    updated_share_count
}
