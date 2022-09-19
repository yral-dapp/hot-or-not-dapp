use candid::Principal;
use ic_stable_memory::{collections::hash_map::SHashMap, utils::ic_types::SPrincipal};
use shared_utils::access_control::{get_global_sprincipal, UserAccessRole};

pub fn setup_initial_access_control(
    user_id_access_control_map: &mut SHashMap<SPrincipal, Vec<UserAccessRole>>,
) {
    // * add global owner
    user_id_access_control_map.insert(
        get_global_sprincipal(),
        &vec![
            UserAccessRole::CanisterController,
            UserAccessRole::CanisterAdmin,
        ],
    );

    // * add user_index canister as a project sibling canister
    user_id_access_control_map.insert(
        SPrincipal(Principal::from_text(option_env!("CANISTER_ID_user_index").unwrap()).unwrap()),
        &vec![UserAccessRole::ProjectCanister],
    );
}
