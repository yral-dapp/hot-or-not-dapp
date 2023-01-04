use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::access_control::{self, UserAccessRole};

use crate::data::{AccessControlMap, LastRunUpgradeStatus};

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_index_details_last_upgrade_status() -> LastRunUpgradeStatus {
    let user_id_access_control_map: AccessControlMap = s!(AccessControlMap);
    assert!(access_control::does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::CanisterAdmin,
        SPrincipal(ic_cdk::caller())
    ));

    s!(LastRunUpgradeStatus)
}
