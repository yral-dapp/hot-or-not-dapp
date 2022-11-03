use candid::Principal;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use post_cache_lib::AccessControlMap;
use shared_utils::access_control::{self, add_role_to_principal_id, UserAccessRole};

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_user_add_role(role: UserAccessRole, principal_id: Principal) {
    let user_id_access_control_map: AccessControlMap = s!(AccessControlMap);
    assert!(access_control::does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::CanisterAdmin,
        SPrincipal(ic_cdk::caller())
    ));

    let mut user_id_access_control_map: AccessControlMap = s!(AccessControlMap);
    add_role_to_principal_id(
        &mut user_id_access_control_map,
        SPrincipal(principal_id),
        role,
    );
    s! { AccessControlMap = user_id_access_control_map };
}
