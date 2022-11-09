use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::access_control::{self, UserAccessRole};
use user_index_lib::{AccessControlMap, UserPrincipalIdToCanisterIdMap};

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn delete_user_index_reset_user_canisters() {
    let user_id_access_control_map: AccessControlMap = s!(AccessControlMap);
    assert!(access_control::does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::CanisterAdmin,
        SPrincipal(ic_cdk::caller())
    ));
    s! { UserPrincipalIdToCanisterIdMap = UserPrincipalIdToCanisterIdMap::new() };
}
