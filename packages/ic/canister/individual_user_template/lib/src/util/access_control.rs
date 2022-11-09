use ic_stable_memory::{collections::hash_map::SHashMap, s, utils::ic_types::SPrincipal};
use shared_utils::{
    access_control::UserAccessRole,
    constant::{
        get_global_super_admin_principal_id, get_post_cache_canister_principal_id,
        get_user_index_canister_principal_id,
    },
    shared_types::init_args::IndividualUserTemplateInitArgs,
};

use crate::MyKnownPrincipalIdsMap;

pub fn setup_initial_access_control(
    user_id_access_control_map: &mut SHashMap<SPrincipal, Vec<UserAccessRole>>,
    init_args: IndividualUserTemplateInitArgs,
) {
    let known_principal_ids: MyKnownPrincipalIdsMap = s!(MyKnownPrincipalIdsMap);
    // * add global owner
    user_id_access_control_map.insert(
        SPrincipal(get_global_super_admin_principal_id(
            known_principal_ids.clone(),
        )),
        &vec![
            UserAccessRole::CanisterController,
            UserAccessRole::CanisterAdmin,
        ],
    );

    // * add user index parent canister
    user_id_access_control_map.insert(
        SPrincipal(get_user_index_canister_principal_id(
            known_principal_ids.clone(),
        )),
        &vec![
            UserAccessRole::CanisterController,
            UserAccessRole::CanisterAdmin,
            UserAccessRole::ProjectCanister,
        ],
    );

    // * add user whose profile details are stored in this canister
    user_id_access_control_map.insert(
        SPrincipal(init_args.profile_owner),
        &vec![UserAccessRole::ProfileOwner],
    );

    // * add post_cache canister as a project sibling canister
    user_id_access_control_map.insert(
        SPrincipal(get_post_cache_canister_principal_id(known_principal_ids)),
        &vec![UserAccessRole::ProjectCanister],
    );
}
