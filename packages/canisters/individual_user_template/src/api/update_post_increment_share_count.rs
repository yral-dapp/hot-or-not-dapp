use crate::AllCreatedPosts;
use ic_stable_memory::s;

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_post_increment_share_count(id: u64) -> u64 {
    let mut all_posts_mut: AllCreatedPosts = s!(AllCreatedPosts);
    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();

    let updated_share_count = post_to_update.increment_share_count();
    all_posts_mut.replace(id, &post_to_update);
    s! { AllCreatedPosts = all_posts_mut };
    updated_share_count
}
