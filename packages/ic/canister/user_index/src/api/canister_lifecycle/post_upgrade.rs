use std::time::Duration;

use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::access_control::UserAccessRole;

use crate::{
    api::{
        backup::backup_data_to_backup_canister,
        well_known_principal::update_locally_stored_well_known_principals,
    },
    data::{
        AccessControlMap, LastRunUpgradeStatus, MyKnownPrincipalIdsMap,
        UniqueUserNameToUserPrincipalIdMap, UserPrincipalIdToCanisterIdMap,
    },
    CANISTER_DATA,
};

// use super::pre_upgrade;

#[ic_cdk_macros::post_upgrade]
fn post_upgrade() {
    restore_data_from_stable_memory();
    // pre_upgrade::pre_upgrade();
    duplicate_stable_memory_data_to_heap();
    refetch_well_known_principals();
    initiate_backup_to_backup_canister();
}

fn restore_data_from_stable_memory() {
    // * reinitialize stable memory and variables
    ic_stable_memory::stable_memory_post_upgrade(0);
}

fn refetch_well_known_principals() {
    ic_cdk::timer::set_timer(Duration::from_secs(1), || {
        ic_cdk::spawn(update_locally_stored_well_known_principals::update_locally_stored_well_known_principals())
    });
}

fn initiate_backup_to_backup_canister() {
    ic_cdk::timer::set_timer(Duration::from_secs(10), || {
        ic_cdk::spawn(backup_data_to_backup_canister::backup_data_to_backup_canister())
    });
}

fn duplicate_stable_memory_data_to_heap() {
    // * copy stable variables to heap memory
    // upgrade status
    let last_run_upgrade_status = s!(LastRunUpgradeStatus);
    CANISTER_DATA.with(|canister_data| {
        canister_data.borrow_mut().last_run_upgrade_status = last_run_upgrade_status.into();
    });

    // known principal ids
    let my_known_principal_ids_map = s!(MyKnownPrincipalIdsMap);
    CANISTER_DATA.with(|canister_data| {
        canister_data.borrow_mut().known_principal_ids = my_known_principal_ids_map
            .iter()
            .map(|(k, v)| (k.clone(), v.0))
            .collect();
    });

    // access control
    let access_control_map = s!(AccessControlMap);
    CANISTER_DATA.with(|canister_data| {
        let mut iterator_over_map = access_control_map.iter();

        while iterator_over_map.has_next() {
            let (user_principal_id, user_roles): (SPrincipal, Vec<UserAccessRole>) =
                iterator_over_map.next().unwrap();
            canister_data
                .borrow_mut()
                .access_control_map
                .insert(user_principal_id.0, user_roles);
        }
    });

    // user principal id to canister id map
    let user_principal_id_to_canister_id_map = s!(UserPrincipalIdToCanisterIdMap);
    CANISTER_DATA.with(|canister_data| {
        let mut iterator_over_map = user_principal_id_to_canister_id_map.iter();

        while iterator_over_map.has_next() {
            let (user_principal_id, canister_id): (SPrincipal, SPrincipal) =
                iterator_over_map.next().unwrap();
            canister_data
                .borrow_mut()
                .user_principal_id_to_canister_id_map
                .insert(user_principal_id.0, canister_id.0);
        }
    });

    // unique user name to user principal id map
    let unique_user_name_to_user_principal_id_map = s!(UniqueUserNameToUserPrincipalIdMap);
    CANISTER_DATA.with(|canister_data| {
        let mut iterator_over_map = unique_user_name_to_user_principal_id_map.iter();

        while iterator_over_map.has_next() {
            let (unique_user_name, user_principal_id): (String, SPrincipal) =
                iterator_over_map.next().unwrap();
            canister_data
                .borrow_mut()
                .unique_user_name_to_user_principal_id_map
                .insert(unique_user_name, user_principal_id.0);
        }
    });
}
