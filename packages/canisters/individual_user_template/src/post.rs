use crate::{AllCreatedPosts, Profile};
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use internal::{
    Post, PostDetailsForFrontend, PostDetailsFromFrontend, PostStatus, PostViewDetailsFromFrontend,
};

pub mod internal;

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn add_post(post_details: PostDetailsFromFrontend) -> u64 {
    // TODO: add validation so only canister owner can add posts

    let mut all_posts_mut = s!(AllCreatedPosts);
    let id = all_posts_mut.len();

    let post = Post::new(
        id,
        post_details.description,
        post_details.hashtags,
        post_details.video_url,
    );

    all_posts_mut.push(&post);

    s! { AllCreatedPosts = all_posts_mut };

    id
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_post_add_view_details(id: u64, details: PostViewDetailsFromFrontend) {
    let mut all_posts_mut = s!(AllCreatedPosts);

    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();

    post_to_update.add_view_details(details);
    all_posts_mut.replace(id, &post_to_update);

    s! { AllCreatedPosts = all_posts_mut };
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_post_as_ready_to_view(id: u64) {
    // TODO: implement access control and allow only principals in allow list. To only be called from a cloud function.
    let mut all_posts_mut = s!(AllCreatedPosts);
    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();
    post_to_update.update_status(PostStatus::ReadyToView);
    all_posts_mut.replace(id, &post_to_update);
    s! { AllCreatedPosts = all_posts_mut };
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_post_increment_share_count(id: u64) -> u64 {
    let mut all_posts_mut = s!(AllCreatedPosts);
    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();

    let updated_share_count = post_to_update.increment_share_count();
    all_posts_mut.replace(id, &post_to_update);
    s! { AllCreatedPosts = all_posts_mut };
    updated_share_count
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_post_toggle_like_status_by_caller(id: u64) -> bool {
    let caller_id = SPrincipal(ic_cdk::caller());

    let mut all_posts_mut = s!(AllCreatedPosts);
    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();

    let updated_like_status = post_to_update.toggle_like_status(&caller_id);
    all_posts_mut.replace(id, &post_to_update);
    s! { AllCreatedPosts = all_posts_mut };

    updated_like_status
}

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_post_with_pagination(
    from_inclusive_id: u64,
    mut to_exclusive_id: u64,
) -> Vec<PostDetailsForFrontend> {
    let all_posts = s!(AllCreatedPosts);

    if to_exclusive_id > (all_posts.len()) {
        to_exclusive_id = all_posts.len();
    }

    assert!(
        from_inclusive_id < all_posts.len(),
        "From value cannot be greater than total number of posts"
    );
    assert!(
        (to_exclusive_id - from_inclusive_id) <= 100,
        "Cannot fetch more than 100 posts in a single request"
    );

    let user_profile = s!(Profile);

    (from_inclusive_id..to_exclusive_id)
        .map(|id| {
            all_posts
                .get_cloned(id)
                .unwrap()
                .get_post_details_for_frontend_for_this_post(
                    user_profile.get_post_attached_user_profile_details_for_frontend(),
                    SPrincipal(ic_cdk::caller()),
                )
        })
        .collect()
}
