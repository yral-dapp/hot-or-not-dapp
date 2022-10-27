use crate::AccessControlMap;
use candid::Principal;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::access_control::{self, UserAccessRole};

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_user_roles(principal_id: Principal) -> Vec<UserAccessRole> {
    let user_id_access_control_map: AccessControlMap = s!(AccessControlMap);
    access_control::get_role_for_principal_id(&user_id_access_control_map, SPrincipal(principal_id))
}
