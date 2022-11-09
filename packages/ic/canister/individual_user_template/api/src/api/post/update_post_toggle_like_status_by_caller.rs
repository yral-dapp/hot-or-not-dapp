use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use individual_user_template_lib::AllCreatedPosts;

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_post_toggle_like_status_by_caller(id: u64) -> bool {
    let caller_id = SPrincipal(ic_cdk::caller());

    let mut all_posts_mut: AllCreatedPosts = s!(AllCreatedPosts);
    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();

    let updated_like_status = post_to_update.toggle_like_status(&caller_id);
    all_posts_mut.replace(id, &post_to_update);
    s! { AllCreatedPosts = all_posts_mut };

    updated_like_status
}
