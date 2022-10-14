use crate::{
    internal::util::canister_management, AccessControlMap, LastRunUpgradeStatus,
    UserPrincipalIdToCanisterIdMap,
};
use candid::CandidType;
use ic_cdk::api::management_canister::main::CanisterInstallMode;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::{
    access_control::{self, UserAccessRole},
    date_time::get_current_system_time::get_current_system_time_from_ic,
};
use speedy::{Readable, Writable};
use std::time::SystemTime;

#[derive(CandidType, Readable, Writable)]
pub struct UpgradeStatus {
    version_number: u64,
    last_run_on: SystemTime,
    successful_upgrade_count: u32,
    failed_canister_ids: Vec<(SPrincipal, SPrincipal)>,
}

impl UpgradeStatus {
    pub fn new() -> Self {
        Self {
            version_number: 0,
            last_run_on: get_current_system_time_from_ic(),
            successful_upgrade_count: 0,
            failed_canister_ids: Vec::new(),
        }
    }
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn update_user_index_upgrade_user_canisters_with_latest_wasm() -> UpgradeStatus {
    let user_id_access_control_map: AccessControlMap = s!(AccessControlMap);
    assert!(access_control::does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::CanisterAdmin,
        SPrincipal(ic_cdk::caller())
    ));

    let mut upgrade_count = 0;
    let mut failed_canister_ids = Vec::new();

    let user_principal_id_to_canister_id_map: UserPrincipalIdToCanisterIdMap =
        s!(UserPrincipalIdToCanisterIdMap);
    let saved_upgrade_status = s!(LastRunUpgradeStatus);

    let mut iterator_over_map = user_principal_id_to_canister_id_map.iter();

    ic_cdk::print(format!("\n\n\n"));

    while iterator_over_map.has_next() {
        let (key, value) = iterator_over_map.next().unwrap();

        match canister_management::upgrade_individual_user_canister(
            value.0,
            CanisterInstallMode::Upgrade,
            saved_upgrade_status.version_number + 1,
        )
        .await
        {
            Ok(_) => {
                ic_cdk::print(format!(
                    "Upgrade canister {:?} successfully belonging to user {:?}",
                    value.0.to_text(),
                    key.0.to_text()
                ));

                upgrade_count += 1;
            }
            Err(_) => {
                ic_cdk::print(format!(
                    "Failed to upgrade canister {:?} belonging to user {:?}",
                    value.0.to_text(),
                    key.0.to_text()
                ));
                failed_canister_ids.push((key, value));
            }
        }
    }

    let new_upgrade_status = UpgradeStatus {
        version_number: saved_upgrade_status.version_number + 1,
        last_run_on: get_current_system_time_from_ic(),
        successful_upgrade_count: upgrade_count,
        failed_canister_ids,
    };

    s! { LastRunUpgradeStatus = new_upgrade_status };

    new_upgrade_status
}
