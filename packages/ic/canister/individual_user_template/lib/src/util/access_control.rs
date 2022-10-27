use candid::Principal;
use ic_stable_memory::{collections::hash_map::SHashMap, utils::ic_types::SPrincipal};
use shared_utils::{
    access_control::UserAccessRole,
    constant::{get_global_owner_principal_id, get_post_cache_canister_principal_id},
};

pub fn setup_initial_access_control(
    user_id_access_control_map: &mut SHashMap<SPrincipal, Vec<UserAccessRole>>,
    parent_canister_principal_id: Principal,
    parent_canister_owner_principal_id: Principal,
) {
    // * add global owner
    user_id_access_control_map.insert(
        SPrincipal(get_global_owner_principal_id()),
        &vec![
            UserAccessRole::CanisterController,
            UserAccessRole::CanisterAdmin,
        ],
    );

    // * add user index parent canister
    user_id_access_control_map.insert(
        SPrincipal(parent_canister_principal_id),
        &vec![
            UserAccessRole::CanisterController,
            UserAccessRole::CanisterAdmin,
            UserAccessRole::ProjectCanister,
        ],
    );

    // * add user whose profile details are stored in this canister
    user_id_access_control_map.insert(
        SPrincipal(parent_canister_owner_principal_id),
        &vec![UserAccessRole::ProfileOwner],
    );

    // * add post_cache canister as a project sibling canister
    user_id_access_control_map.insert(
        SPrincipal(get_post_cache_canister_principal_id()),
        &vec![UserAccessRole::ProjectCanister],
    );
}
