use crate::constant::GLOBAL_OWNER_PRINCIPAL_ID;
use candid::{CandidType, Deserialize, Principal};
use ic_stable_memory::{collections::hash_map::SHashMap, utils::ic_types::SPrincipal};
use speedy::{Readable, Writable};

/// The different user roles to be used in access control for principals
/// making calls to a canister
#[derive(Readable, Writable, PartialEq, Eq, Debug, CandidType, Deserialize)]
pub enum UserAccessRole {
    /// User has canister WASM install/uninstall/delete capabilities
    CanisterController,
    /// User has edit access to all data residing in the canister
    CanisterAdmin,
    /// Data in this canister is the data of this user
    ProfileOwner,
}

pub fn get_global_sprincipal() -> SPrincipal {
    SPrincipal(Principal::from_text(GLOBAL_OWNER_PRINCIPAL_ID).unwrap())
}

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
}

/// Helper method to check if a principal has requisite access
/// to make the canister call
pub fn does_principal_have_role(
    user_id_access_control_map: &SHashMap<SPrincipal, Vec<UserAccessRole>>,
    role_required: UserAccessRole,
    principal: SPrincipal,
) -> bool {
    match user_id_access_control_map.get_cloned(&principal) {
        Some(roles) => roles.contains(&role_required),
        None => false,
    }
}

pub fn add_role_to_principal_id(
    user_id_access_control_map: &mut SHashMap<SPrincipal, Vec<UserAccessRole>>,
    user_id: SPrincipal,
    role: UserAccessRole,
) {
    assert!(does_principal_have_role(
        user_id_access_control_map,
        UserAccessRole::CanisterAdmin,
        SPrincipal(ic_cdk::caller())
    ));

    let mut roles = user_id_access_control_map
        .get_cloned(&user_id)
        .unwrap_or(vec![]);
    roles.push(role);

    user_id_access_control_map.insert(user_id, &roles);
}

pub fn remove_role_from_principal_id(
    user_id_access_control_map: &mut SHashMap<SPrincipal, Vec<UserAccessRole>>,
    user_id: SPrincipal,
    role: UserAccessRole,
) {
    assert!(does_principal_have_role(
        user_id_access_control_map,
        UserAccessRole::CanisterAdmin,
        SPrincipal(ic_cdk::caller())
    ));

    let mut roles = user_id_access_control_map
        .get_cloned(&user_id)
        .unwrap_or(vec![]);
    roles.retain(|r| r != &role);

    user_id_access_control_map.insert(user_id, &roles);
}

pub fn get_role_for_principal_id(
    user_id_access_control_map: &SHashMap<SPrincipal, Vec<UserAccessRole>>,
    user_id: SPrincipal,
) -> Vec<UserAccessRole> {
    user_id_access_control_map
        .get_cloned(&user_id)
        .unwrap_or(vec![])
}
