use candid::{candid_method, export_service};
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, query, update};
use ic_kit::ic;
use ic_stable_memory::{
    collections::vec::SVec, s, stable_memory_init, stable_memory_post_upgrade,
    stable_memory_pre_upgrade, utils::ic_types::SPrincipal,
};
use post::{Post, PostDetailsFromFrontend, PostStatus, PostViewDetailsFromFrontend};
use profile::UserProfile;

mod post;
mod profile;
#[cfg(test)]
mod test;

// * Stable Variables
type Profile = UserProfile;

// * Stable Collections
type AllowList = SVec<SPrincipal>;
type AllCreatedPosts = SVec<Post>;

#[init]
fn init() {
    // * initialize stable memory
    stable_memory_init(true, 0);

    // * initialize stable variables
    s! {AllowList = AllowList::new()};
    s! {AllCreatedPosts = AllCreatedPosts::new()};
    // s! {Profile = Profile::new()};
}

#[pre_upgrade]
fn pre_upgrade() {
    // * save stable variables meta-info
    stable_memory_pre_upgrade();
}

#[post_upgrade]
fn post_upgrade() {
    // * reinitialize stable memory and variables
    stable_memory_post_upgrade(0);
}

#[update]
#[candid_method(update)]
fn create_post(post_details: PostDetailsFromFrontend) -> u64 {
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

#[update]
#[candid_method(update)]
fn update_post_add_view_details(id: u64, details: PostViewDetailsFromFrontend) {
    let mut all_posts_mut = s!(AllCreatedPosts);

    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();

    post_to_update.add_view_details(details);
    all_posts_mut.replace(id, &post_to_update);

    s! { AllCreatedPosts = all_posts_mut };
}

#[update]
#[candid_method(update)]
fn update_post_as_ready_to_view(id: u64) {
    // TODO: implement access control and allow only principals in allow list. To only be called from a cloud function.
    let mut all_posts_mut = s!(AllCreatedPosts);
    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();
    post_to_update.update_status(PostStatus::ReadyToView);
    all_posts_mut.replace(id, &post_to_update);
    s! { AllCreatedPosts = all_posts_mut };
}

#[update]
#[candid_method(update)]
fn update_post_increment_share_count(id: u64) -> u64 {
    let mut all_posts_mut = s!(AllCreatedPosts);
    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();

    let updated_share_count = post_to_update.increment_share_count();
    all_posts_mut.replace(id, &post_to_update);
    s! { AllCreatedPosts = all_posts_mut };
    updated_share_count
}

#[update]
#[candid_method(update)]
fn update_post_toggle_like_status_by_caller(id: u64) -> bool {
    let caller_id = SPrincipal(ic::caller());

    let mut all_posts_mut = s!(AllCreatedPosts);
    let mut post_to_update = all_posts_mut.get_cloned(id).unwrap();

    let updated_like_status = post_to_update.toggle_like_status(&caller_id);
    all_posts_mut.replace(id, &post_to_update);
    s! { AllCreatedPosts = all_posts_mut };

    updated_like_status
}

#[query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    export_service!();
    __export_service()
}
