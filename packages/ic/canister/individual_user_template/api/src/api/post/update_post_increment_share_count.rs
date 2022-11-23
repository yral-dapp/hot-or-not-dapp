use ic_stable_memory::s;
use individual_user_template_lib::AllCreatedPostsV1;

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_post_increment_share_count(id: u64) -> u64 {
    let mut all_posts: AllCreatedPostsV1 = s!(AllCreatedPostsV1);
    let mut post_to_update = all_posts.get_cloned(id).unwrap();

    let updated_share_count = post_to_update.increment_share_count();
    all_posts.replace(id, &post_to_update);
    s! { AllCreatedPostsV1 = all_posts };

    updated_share_count
}
