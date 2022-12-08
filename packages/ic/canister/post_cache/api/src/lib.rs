use std::{cell::RefCell, collections::HashMap};

use candid::{export_service, Principal};
use ic_stable_memory::{
    s, stable_memory_init, stable_memory_post_upgrade, stable_memory_pre_upgrade,
    utils::ic_types::SPrincipal,
};
use post_cache_lib::{
    access_control::setup_initial_access_control, util::known_principal_ids, AccessControlMap,
    CanisterData, MyKnownPrincipalIdsMap, PostsIndexSortedByHomeFeedScore,
    PostsIndexSortedByHotOrNotFeedScore, PostsIndexSortedByScore,
};
use shared_utils::{
    access_control::UserAccessRole,
    types::{
        canister_specific::post_cache::error_types::TopPostsFetchError,
        init_args::PostCacheInitArgs, top_posts::v0::PostScoreIndexItem,
    },
};

mod api;
#[cfg(test)]
mod test;

thread_local! {
    static CANISTER_DATA: RefCell<CanisterData> = RefCell::default();
}

#[ic_cdk_macros::init]
#[candid::candid_method(init)]
fn init(init_args: PostCacheInitArgs) {
    // * initialize stable memory
    stable_memory_init(true, 0);

    // * initialize stable variables
    s! { MyKnownPrincipalIdsMap = HashMap::new() }
    known_principal_ids::save_known_principal_ids_from_user_index_init_args_to_my_known_principal_ids_map(init_args);

    // * initialize stable collections
    s! { AccessControlMap = AccessControlMap::new_with_capacity(100) };
    s! { PostsIndexSortedByScore = PostsIndexSortedByScore::new() };
    s! { PostsIndexSortedByHomeFeedScore = PostsIndexSortedByHomeFeedScore::default() };
    s! { PostsIndexSortedByHotOrNotFeedScore = PostsIndexSortedByHotOrNotFeedScore::default() };

    // * initialize access control
    let mut user_id_access_control_map = s!(AccessControlMap);
    setup_initial_access_control(&mut user_id_access_control_map);
    s! { AccessControlMap = user_id_access_control_map };
}

#[ic_cdk_macros::pre_upgrade]
fn pre_upgrade() {
    // * save stable variables meta-info
    stable_memory_pre_upgrade();
}

#[ic_cdk_macros::post_upgrade]
fn post_upgrade() {
    // * reinitialize stable memory and variables
    stable_memory_post_upgrade(0);

    // * copy all data to heap
    // my known principal ids map
    let my_known_principal_ids_map = s!(MyKnownPrincipalIdsMap);
    CANISTER_DATA.with(|canister_data_ref_cell| {
        canister_data_ref_cell
            .borrow_mut()
            .my_known_principal_ids_map = my_known_principal_ids_map;
    });

    // access control map
    let access_control_map = s!(AccessControlMap);
    CANISTER_DATA.with(|canister_data_ref_cell| {
        let access_control_map_ref = &mut canister_data_ref_cell.borrow_mut().access_control_map;

        let mut iterator_over_map = access_control_map.iter();

        while iterator_over_map.has_next() {
            let (user_principal_id, user_roles): (SPrincipal, Vec<UserAccessRole>) =
                iterator_over_map.next().unwrap();
            access_control_map_ref.insert(user_principal_id, user_roles);
        }
    });

    // posts index sorted by home feed score
    let posts_index_sorted_by_home_feed_score = s!(PostsIndexSortedByHomeFeedScore);
    CANISTER_DATA.with(|canister_data_ref_cell| {
        canister_data_ref_cell
            .borrow_mut()
            .posts_index_sorted_by_home_feed_score = posts_index_sorted_by_home_feed_score;
    });

    // posts index sorted by hot or not feed score
    let posts_index_sorted_by_hot_or_not_feed_score = s!(PostsIndexSortedByHotOrNotFeedScore);
    CANISTER_DATA.with(|canister_data_ref_cell| {
        canister_data_ref_cell
            .borrow_mut()
            .posts_index_sorted_by_hot_or_not_feed_score =
            posts_index_sorted_by_hot_or_not_feed_score;
    });

    // * initialize stable memory
    stable_memory_init(true, 0);

    // * initialize stable variables
    s! { MyKnownPrincipalIdsMap = HashMap::new() }
    known_principal_ids::save_known_principal_ids_from_user_index_init_args_to_my_known_principal_ids_map(PostCacheInitArgs { known_principal_ids: HashMap::new() });

    // * initialize stable collections
    s! { AccessControlMap = AccessControlMap::new_with_capacity(100) };
    s! { PostsIndexSortedByScore = PostsIndexSortedByScore::new() };
    s! { PostsIndexSortedByHomeFeedScore = PostsIndexSortedByHomeFeedScore::default() };
    s! { PostsIndexSortedByHotOrNotFeedScore = PostsIndexSortedByHotOrNotFeedScore::default() };

    // * initialize access control
    let mut user_id_access_control_map = s!(AccessControlMap);
    setup_initial_access_control(&mut user_id_access_control_map);
    s! { AccessControlMap = user_id_access_control_map };
}

#[ic_cdk_macros::query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    export_service!();
    __export_service()
}
