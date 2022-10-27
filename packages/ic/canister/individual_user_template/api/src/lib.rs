use api::{
    get_posts_of_this_user_profile_with_pagination::GetPostsOfUserProfileError,
    get_principals_i_follow_paginated::GetFollowerOrFollowingError,
    update_principals_i_follow_toggle_list_with_principal_specified::FollowAnotherUserProfileError,
    update_principals_that_follow_me_toggle_list_with_specified_principal::AnotherUserFollowedMeError,
    update_profile_display_details::UpdateProfileDetailsError,
    update_profile_set_unique_username_once::UpdateProfileSetUniqueUsernameError,
};
use candid::{export_service, Principal};
use ic_cdk::api::call;
use ic_stable_memory::{
    s, stable_memory_init, stable_memory_post_upgrade, stable_memory_pre_upgrade,
};
use individual_user_template_lib::{
    model::{
        post::{PostDetailsForFrontend, PostViewDetailsFromFrontend},
        profile::{UserProfileDetailsForFrontend, UserProfileUpdateDetailsFromFrontend},
        version_details::VersionDetails,
    },
    util::{access_control, periodic_update},
    AccessControlMap, AllCreatedPosts, PostsIndexSortedByScore, PostsIndexSortedByScoreV1,
    PrincipalsIFollow, PrincipalsThatFollowMe, Profile, SVersionDetails,
};
use shared_utils::{access_control::UserAccessRole, shared_types::post::PostDetailsFromFrontend};

mod api;
#[cfg(test)]
mod test;

#[ic_cdk_macros::init]
fn init() {
    // * initialize stable memory
    stable_memory_init(true, 0);

    // * initialize stable variables
    s! { Profile = Profile::new(call::arg_data::<(Principal, Principal)>().1) };
    s! { SVersionDetails = VersionDetails::new() };

    // * initialize stable collections
    s! { AllCreatedPosts = AllCreatedPosts::new() };
    s! { AccessControlMap = AccessControlMap::new_with_capacity(100) };
    s! { PostsIndexSortedByScore = PostsIndexSortedByScore::new() };
    s! { PostsIndexSortedByScoreV1 = PostsIndexSortedByScoreV1::default() };
    s! { PrincipalsIFollow = PrincipalsIFollow::new() };
    s! { PrincipalsThatFollowMe = PrincipalsThatFollowMe::new() };

    // * initialize access control
    let mut user_id_access_control_map = s!(AccessControlMap);
    access_control::setup_initial_access_control(
        &mut user_id_access_control_map,
        call::arg_data::<(Principal, Principal)>().0,
        call::arg_data::<(Principal, Principal)>().1,
    );
    s! { AccessControlMap = user_id_access_control_map };

    // * initialize periodic update
    periodic_update::share_top_post_scores_with_post_cache_canister();
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

    // * set schema version number received from user_index canister
    s! { SVersionDetails = SVersionDetails::get_updated_version_details(call::arg_data::<(u64, )>().0) };
}

#[ic_cdk_macros::query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    export_service!();
    __export_service()
}
