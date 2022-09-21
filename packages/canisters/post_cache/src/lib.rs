use access_control::util::setup_initial_access_control;
use candid::{export_service, Principal};
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, query};
use ic_stable_memory::{
    collections::hash_map::SHashMap, s, stable_memory_init, stable_memory_post_upgrade,
    stable_memory_pre_upgrade, utils::ic_types::SPrincipal,
};
use post::TopPostsFetchError;
use shared_utils::{access_control::UserAccessRole, shared_types::top_posts::PostScoreIndexItem};
use std::collections::BTreeSet;

mod access_control;
mod post;
mod score_ranking;
#[cfg(test)]
mod test;

// * Stable Variables

// * Stable collections
pub type AccessControlMap = SHashMap<SPrincipal, Vec<UserAccessRole>>;
pub type PostsIndexSortedByScore = BTreeSet<PostScoreIndexItem>;

#[init]
fn init() {
    // * initialize stable memory
    stable_memory_init(true, 0);

    // * initialize stable variables
    s! { AccessControlMap = AccessControlMap::new_with_capacity(100) };
    s! { PostsIndexSortedByScore = PostsIndexSortedByScore::new() };

    // * initialize access control
    let mut user_id_access_control_map = s!(AccessControlMap);
    setup_initial_access_control(&mut user_id_access_control_map);
    s! { AccessControlMap = user_id_access_control_map };
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

#[query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    export_service!();
    __export_service()
}
