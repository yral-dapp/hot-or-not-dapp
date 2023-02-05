use std::time::Duration;

use ic_cdk::api::call;
use ic_stable_memory::{s, stable_memory_post_upgrade};

use crate::{
    api::well_known_principal::update_locally_stored_well_known_principals,
    data_model::{
        AllCreatedPostsV1, MyKnownPrincipalIdsMap, MyTokenBalance, PostsIndexSortedByHomeFeedScore,
        PostsIndexSortedByHotOrNotFeedScore, PrincipalsIFollow, PrincipalsThatFollowMe, Profile,
        SVersionDetails,
    },
    util::periodic_update,
    CANISTER_DATA,
};

#[ic_cdk_macros::post_upgrade]
fn post_upgrade() {
    // * reinitialize stable memory and variables
    stable_memory_post_upgrade(0);

    // * set schema version number received from user_index canister
    s! { SVersionDetails = SVersionDetails::get_updated_version_details(call::arg_data::<(u64, )>().0) };

    // * restart periodic update
    periodic_update::share_top_post_scores_with_post_cache_canister_v1();

    copy_data_from_stable_to_heap_memory();
    refetch_well_known_principals();
}

fn copy_data_from_stable_to_heap_memory() {
    // all created posts
    let all_created_posts = s!(AllCreatedPostsV1);
    CANISTER_DATA.with(|canister_data_ref_cell| {
        let mut counter = 0;
        while counter < all_created_posts.len() {
            canister_data_ref_cell
                .borrow_mut()
                .all_created_posts
                .insert(counter, all_created_posts.get_cloned(counter).unwrap());
            counter += 1;
        }
    });

    // known principal ids
    let known_principal_ids = s!(MyKnownPrincipalIdsMap);
    CANISTER_DATA.with(|canister_data_ref_cell| {
        canister_data_ref_cell.borrow_mut().known_principal_ids = known_principal_ids
            .iter()
            .map(|(k, v)| (k.clone(), v.0.clone()))
            .collect();
    });

    // my token balance
    let my_token_balance = s!(MyTokenBalance);
    CANISTER_DATA.with(|canister_data_ref_cell| {
        canister_data_ref_cell.borrow_mut().my_token_balance = my_token_balance;
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

    // principals i follow
    let principals_i_follow = s!(PrincipalsIFollow);
    CANISTER_DATA.with(|canister_data_ref_cell| {
        canister_data_ref_cell.borrow_mut().principals_i_follow =
            principals_i_follow.iter().map(|x| x.0.clone()).collect();
    });

    // principals that follow me
    let principals_that_follow_me = s!(PrincipalsThatFollowMe);
    CANISTER_DATA.with(|canister_data_ref_cell| {
        canister_data_ref_cell
            .borrow_mut()
            .principals_that_follow_me = principals_that_follow_me
            .iter()
            .map(|x| x.0.clone())
            .collect();
    });

    // profile
    let profile = s!(Profile);
    CANISTER_DATA.with(|canister_data_ref_cell| {
        canister_data_ref_cell.borrow_mut().profile = profile.into();
    });

    // version details
    let version_details = s!(SVersionDetails);
    CANISTER_DATA.with(|canister_data_ref_cell| {
        canister_data_ref_cell.borrow_mut().version_details = version_details;
    });
}

const DELAY_FOR_REFETCHING_WELL_KNOWN_PRINCIPALS: Duration = Duration::from_secs(1);
fn refetch_well_known_principals() {
    ic_cdk::timer::set_timer(DELAY_FOR_REFETCHING_WELL_KNOWN_PRINCIPALS, || {
        ic_cdk::spawn(update_locally_stored_well_known_principals::update_locally_stored_well_known_principals())
    });
}
