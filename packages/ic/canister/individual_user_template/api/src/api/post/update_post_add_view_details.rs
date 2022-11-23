use ic_stable_memory::s;
use individual_user_template_lib::{
    model::post::v0::PostViewDetailsFromFrontend, AllCreatedPostsV1,
};

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_post_add_view_details(id: u64, details: PostViewDetailsFromFrontend) {
    let mut all_posts_mut: AllCreatedPostsV1 = s!(AllCreatedPostsV1);

    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();

    post_to_update.add_view_details(details);
    all_posts_mut.replace(id, &post_to_update);

    s! { AllCreatedPostsV1 = all_posts_mut };
}
