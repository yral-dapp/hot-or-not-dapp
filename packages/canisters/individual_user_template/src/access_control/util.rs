use candid::Principal;
use ic_stable_memory::{collections::hash_map::SHashMap, utils::ic_types::SPrincipal};
use shared_utils::access_control::{get_global_sprincipal, UserAccessRole};

pub fn setup_initial_access_control(
    user_id_access_control_map: &mut SHashMap<SPrincipal, Vec<UserAccessRole>>,
    parent_canister_principal_id: Principal,
    parent_canister_owner_principal_id: Principal,
) {
    // * add global owner
    user_id_access_control_map.insert(
        get_global_sprincipal(),
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
}
