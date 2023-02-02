use std::collections::HashMap;

use ic_stable_memory::{s, stable_memory_init};
use individual_user_template_lib::{
    model::version_details::VersionDetails,
    util::{access_control, known_principal_ids, periodic_update},
    AccessControlMap, AllCreatedPosts, AllCreatedPostsV1, MyKnownPrincipalIdsMap, MyTokenBalance,
    PostsIndexSortedByHomeFeedScore, PostsIndexSortedByHotOrNotFeedScore, PostsIndexSortedByScore,
    PrincipalsIFollow, PrincipalsThatFollowMe, Profile, SVersionDetails,
};
use shared_utils::canister_specific::individual_user_template::types::args::IndividualUserTemplateInitArgs;

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
    periodic_update::share_top_post_scores_with_post_cache_canister_v1();
    periodic_update::update_post_scores_every_hour_v1();
}
