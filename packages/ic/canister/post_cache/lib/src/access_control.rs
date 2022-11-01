use ic_stable_memory::{collections::hash_map::SHashMap, s, utils::ic_types::SPrincipal};
use shared_utils::{access_control::UserAccessRole, constant::get_global_super_admin_principal_id};

use crate::MyKnownPrincipalIdsMap;

pub fn setup_initial_access_control(
    user_id_access_control_map: &mut SHashMap<SPrincipal, Vec<UserAccessRole>>,
) {
    let known_principal_ids: MyKnownPrincipalIdsMap = s!(MyKnownPrincipalIdsMap);
    // * add global owner
    user_id_access_control_map.insert(
        SPrincipal(get_global_super_admin_principal_id(known_principal_ids)),
        &vec![
            UserAccessRole::CanisterController,
            UserAccessRole::CanisterAdmin,
        ],
    );
}
