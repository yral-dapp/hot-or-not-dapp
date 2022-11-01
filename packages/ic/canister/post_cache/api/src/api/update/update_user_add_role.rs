use candid::Principal;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use post_cache_lib::AccessControlMap;
use shared_utils::access_control::{add_role_to_principal_id, UserAccessRole};

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_user_add_role(role: UserAccessRole, principal_id: Principal) {
    let mut user_id_access_control_map: AccessControlMap = s!(AccessControlMap);
    add_role_to_principal_id(
        &mut user_id_access_control_map,
        SPrincipal(principal_id),
        role,
    );
    s! { AccessControlMap = user_id_access_control_map };
}
