use ic_stable_memory::{collections::hash_map::SHashMap, utils::ic_types::SPrincipal};
use shared_utils::{access_control::UserAccessRole, constant::get_global_owner_principal_id};

pub fn setup_initial_access_control(
    user_id_access_control_map: &mut SHashMap<SPrincipal, Vec<UserAccessRole>>,
) {
    // * add global owner
    user_id_access_control_map.insert(
        SPrincipal(get_global_owner_principal_id()),
        &vec![
            UserAccessRole::CanisterController,
            UserAccessRole::CanisterAdmin,
        ],
    );
}
