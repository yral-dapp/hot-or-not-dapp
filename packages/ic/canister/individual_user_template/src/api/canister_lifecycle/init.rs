use std::collections::HashMap;

use crate::{
    data_model::{
        version_details::VersionDetails, AccessControlMap, AllCreatedPosts, AllCreatedPostsV1,
        CanisterData, MyKnownPrincipalIdsMap, MyTokenBalance, PostsIndexSortedByHomeFeedScore,
        PostsIndexSortedByHotOrNotFeedScore, PostsIndexSortedByScore, PrincipalsIFollow,
        PrincipalsThatFollowMe, Profile, SVersionDetails,
    },
    util::{access_control, known_principal_ids, periodic_update},
    CANISTER_DATA,
};
use ic_stable_memory::{s, stable_memory_init};
use shared_utils::canister_specific::individual_user_template::types::args::IndividualUserTemplateInitArgs;

#[ic_cdk_macros::init]
#[candid::candid_method(init)]
fn init(init_args: IndividualUserTemplateInitArgs) {
    // * initialize stable memory
    stable_memory_init(true, 0);

    // * initialize stable variables
    s! { Profile = Profile::new(init_args.profile_owner.unwrap()) };
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
    access_control::setup_initial_access_control(&mut user_id_access_control_map, &init_args);
    s! { AccessControlMap = user_id_access_control_map };

    // * initialize periodic update
    periodic_update::share_top_post_scores_with_post_cache_canister_v1();
    periodic_update::update_post_scores_every_hour_v1();

    CANISTER_DATA.with(|canister_data_ref_cell| {
        let mut data = canister_data_ref_cell.borrow_mut();
        init_impl(init_args, &mut data);
    });
}

fn init_impl(init_args: IndividualUserTemplateInitArgs, data: &mut CanisterData) {
    init_args
        .known_principal_ids
        .unwrap_or_default()
        .iter()
        .for_each(|(principal_belongs_to, principal_id)| {
            data.known_principal_ids
                .insert(principal_belongs_to.clone(), principal_id.clone());
        });

    data.profile.principal_id = init_args.profile_owner;
}

#[cfg(test)]
mod test {

    use shared_utils::common::types::known_principal::{KnownPrincipalMapV1, KnownPrincipalType};
    use test_utils::setup::test_constants::{
        get_global_super_admin_principal_id_v1, get_mock_canister_id_configuration,
        get_mock_canister_id_user_index, get_mock_user_alice_principal_id,
    };

    use super::*;

    #[test]
    fn test_init_impl() {
        // * Add some known principals
        let mut known_principal_ids = KnownPrincipalMapV1::new();
        known_principal_ids.insert(
            KnownPrincipalType::UserIdGlobalSuperAdmin,
            get_global_super_admin_principal_id_v1(),
        );
        known_principal_ids.insert(
            KnownPrincipalType::CanisterIdConfiguration,
            get_mock_canister_id_configuration(),
        );
        known_principal_ids.insert(
            KnownPrincipalType::CanisterIdUserIndex,
            get_mock_canister_id_user_index(),
        );

        // * Create the init args
        let init_args = IndividualUserTemplateInitArgs {
            known_principal_ids: Some(known_principal_ids),
            profile_owner: Some(get_mock_user_alice_principal_id()),
        };
        let mut data = CanisterData::default();

        // * Run the init impl
        init_impl(init_args, &mut data);

        // * Check the data
        assert_eq!(
            data.known_principal_ids
                .get(&KnownPrincipalType::UserIdGlobalSuperAdmin)
                .unwrap(),
            &get_global_super_admin_principal_id_v1()
        );
        assert_eq!(
            data.known_principal_ids
                .get(&KnownPrincipalType::CanisterIdConfiguration)
                .unwrap(),
            &get_mock_canister_id_configuration()
        );
        assert_eq!(
            data.known_principal_ids
                .get(&KnownPrincipalType::CanisterIdUserIndex)
                .unwrap(),
            &get_mock_canister_id_user_index()
        );

        assert_eq!(
            data.profile.principal_id,
            Some(get_mock_user_alice_principal_id())
        );
    }
}
