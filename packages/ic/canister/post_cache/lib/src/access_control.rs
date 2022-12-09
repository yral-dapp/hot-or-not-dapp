use std::collections::HashMap;

use ic_stable_memory::{collections::hash_map::SHashMap, s, utils::ic_types::SPrincipal};
use shared_utils::{
    access_control::UserAccessRole, constant::get_global_super_admin_principal_id,
    types::known_principal::KnownPrincipalMap,
};

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

pub fn setup_initial_access_control_v1(
    user_id_access_control_map: &mut HashMap<SPrincipal, Vec<UserAccessRole>>,
    known_principal_ids: &KnownPrincipalMap,
) {
    // * add global owner
    user_id_access_control_map.insert(
        SPrincipal(get_global_super_admin_principal_id(
            known_principal_ids.clone(),
        )),
        vec![
            UserAccessRole::CanisterController,
            UserAccessRole::CanisterAdmin,
        ],
    );
}

#[cfg(test)]
mod test {
    use shared_utils::types::known_principal::{KnownPrincipalMap, KnownPrincipalType};
    use test_utils::setup::test_constants::get_global_super_admin_principal_id;

    use super::*;

    #[test]
    fn test_setup_initial_access_control_v1() {
        let mut user_id_access_control_map = HashMap::new();
        let mut known_principal_ids = KnownPrincipalMap::default();
        let global_super_admin = get_global_super_admin_principal_id();
        known_principal_ids.insert(
            KnownPrincipalType::UserIdGlobalSuperAdmin,
            SPrincipal(global_super_admin.0),
        );

        setup_initial_access_control_v1(&mut user_id_access_control_map, &known_principal_ids);

        assert_eq!(
            user_id_access_control_map.get(&SPrincipal(global_super_admin.0)),
            Some(&vec![
                UserAccessRole::CanisterController,
                UserAccessRole::CanisterAdmin,
            ])
        );
    }
}
