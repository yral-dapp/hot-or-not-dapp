use std::collections::HashMap;

use api::{
    follow::{
        get_principals_i_follow_paginated::GetFollowerOrFollowingError,
        update_principals_i_follow_toggle_list_with_principal_specified::FollowAnotherUserProfileError,
        update_principals_that_follow_me_toggle_list_with_specified_principal::AnotherUserFollowedMeError,
    },
    post::get_posts_of_this_user_profile_with_pagination::GetPostsOfUserProfileError,
    profile::update_profile_display_details::UpdateProfileDetailsError,
};
use candid::{export_service, Principal};
use ic_cdk::api::call;
use ic_stable_memory::{
    s, stable_memory_init, stable_memory_post_upgrade, stable_memory_pre_upgrade,
};
use individual_user_template_lib::{
    model::{
        hot_or_not::HotOrNotBetDetailsForPost,
        post::v0::PostViewDetailsFromFrontend,
        profile::{UserProfileDetailsForFrontend, UserProfileUpdateDetailsFromFrontend},
        version_details::VersionDetails,
    },
    util::{access_control, known_principal_ids, periodic_update},
    AccessControlMap, AllCreatedPosts, AllCreatedPostsV1, MyKnownPrincipalIdsMap, MyTokenBalance,
    PostsIndexSortedByHomeFeedScore, PostsIndexSortedByHotOrNotFeedScore, PostsIndexSortedByScore,
    PrincipalsIFollow, PrincipalsThatFollowMe, Profile, SVersionDetails,
};
use shared_utils::{
    access_control::UserAccessRole,
    types::{
        canister_specific::individual_user_template::{
            error_types::{
                GetUserUtilityTokenTransactionHistoryError, UpdateProfileSetUniqueUsernameError,
            },
            post::PostDetailsForFrontend,
        },
        init_args::IndividualUserTemplateInitArgs,
        post::PostDetailsFromFrontend,
        utility_token::v1::TokenEventV1,
    },
};

mod api;
#[cfg(test)]
mod test;

#[ic_cdk_macros::init]
#[candid::candid_method(init)]
fn init(init_args: IndividualUserTemplateInitArgs) {
    // * initialize stable memory
    stable_memory_init(true, 0);

    // * initialize stable variables
    s! { Profile = Profile::new(init_args.profile_owner) };
    s! { SVersionDetails = VersionDetails::new() };
    s! { MyKnownPrincipalIdsMap = HashMap::new() }
    known_principal_ids::save_known_principal_ids_from_user_index_init_args_to_my_known_principal_ids_map(&init_args);
    s! { MyTokenBalance = MyTokenBalance::default() };

    // * initialize stable collections
    s! { AllCreatedPosts = AllCreatedPosts::new() };
    s! { AccessControlMap = AccessControlMap::new_with_capacity(100) };
    s! { PostsIndexSortedByScore = PostsIndexSortedByScore::new() };
    s! { PostsIndexSortedByHomeFeedScore = PostsIndexSortedByHomeFeedScore::default() };
    s! { PostsIndexSortedByHotOrNotFeedScore = PostsIndexSortedByHotOrNotFeedScore::default() };
    s! { PrincipalsIFollow = PrincipalsIFollow::new() };
    s! { PrincipalsThatFollowMe = PrincipalsThatFollowMe::new() };
    s! { AllCreatedPostsV1 = AllCreatedPostsV1::new() };

    // * initialize access control
    let mut user_id_access_control_map = s!(AccessControlMap);
    access_control::setup_initial_access_control(&mut user_id_access_control_map, init_args);
    s! { AccessControlMap = user_id_access_control_map };

    // * initialize periodic update
    periodic_update::share_top_post_scores_with_post_cache_canister();
    periodic_update::update_post_scores_every_hour();
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
