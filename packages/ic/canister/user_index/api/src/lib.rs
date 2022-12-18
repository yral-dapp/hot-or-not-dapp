use std::{cell::RefCell, collections::HashMap};

use candid::{export_service, Principal};
use ic_cdk::api::management_canister::main::CanisterStatusResponse;
use ic_stable_memory::{
    s, stable_memory_init, stable_memory_post_upgrade, stable_memory_pre_upgrade,
};
use shared_utils::{
    access_control::UserAccessRole,
    types::{
        canister_specific::user_index::error_types::SetUniqueUsernameError,
        init_args::UserIndexInitArgs,
    },
};
use user_index_lib::{
    model::upgrade_status::UpgradeStatus,
    util::{access_control, known_principal_ids},
    AccessControlMap, CanisterData, LastRunUpgradeStatus, MyKnownPrincipalIdsMap,
    UniqueUserNameToUserPrincipalIdMap, UserPrincipalIdToCanisterIdMap,
};

mod api;
#[cfg(test)]
mod test;

thread_local! {
    static CANISTER_DATA: RefCell<CanisterData> = RefCell::default();
}

#[ic_cdk_macros::init]
#[candid::candid_method(init)]
fn init(init_args: UserIndexInitArgs) {
    // * initialize stable memory
    stable_memory_init(true, 0);

    // * initialize stable variables
    s! { LastRunUpgradeStatus = LastRunUpgradeStatus::new() }
    s! { MyKnownPrincipalIdsMap = HashMap::new() }
    known_principal_ids::save_known_principal_ids_from_user_index_init_args_to_my_known_principal_ids_map(init_args);

    // * initialize stable collections
    s! { UserPrincipalIdToCanisterIdMap = UserPrincipalIdToCanisterIdMap::new_with_capacity(200_000) };
    s! { UniqueUserNameToUserPrincipalIdMap = UniqueUserNameToUserPrincipalIdMap::new_with_capacity(100_000) };
    s! { AccessControlMap = AccessControlMap::new_with_capacity(100) };

    // * initialize access control
    let mut user_id_access_control_map = s!(AccessControlMap);
    access_control::setup_initial_access_control(&mut user_id_access_control_map);
    s! { AccessControlMap = user_id_access_control_map };
}

#[ic_cdk_macros::pre_upgrade]
fn pre_upgrade() {
    // * save stable variables meta-info
    stable_memory_pre_upgrade();
}

#[ic_cdk_macros::post_upgrade]
fn post_upgrade() {
    // * reinitialize stable memory and variables
    stable_memory_post_upgrade(0);

    // TODO: reenable this
    // // copy stable variables to heap memory
    // // upgrade status
    // let last_run_upgrade_status = s!(LastRunUpgradeStatus);
    // CANISTER_DATA.with(|canister_data| {
    //     canister_data.borrow_mut().last_run_upgrade_status = last_run_upgrade_status;
    // });

    // // known principal ids
    // let my_known_principal_ids_map = s!(MyKnownPrincipalIdsMap);
    // CANISTER_DATA.with(|canister_data| {
    //     canister_data.borrow_mut().my_known_principal_ids_map = my_known_principal_ids_map;
    // });

    // // access control
    // let access_control_map = s!(AccessControlMap);
    // CANISTER_DATA.with(|canister_data| {
    //     let mut iterator_over_map = access_control_map.iter();

    //     while iterator_over_map.has_next() {
    //         let (user_principal_id, user_roles): (SPrincipal, Vec<UserAccessRole>) =
    //             iterator_over_map.next().unwrap();
    //         canister_data
    //             .borrow_mut()
    //             .access_control_map
    //             .insert(user_principal_id.0, user_roles);
    //     }
    // });

    // // user principal id to canister id map
    // let user_principal_id_to_canister_id_map = s!(UserPrincipalIdToCanisterIdMap);
    // CANISTER_DATA.with(|canister_data| {
    //     let mut iterator_over_map = user_principal_id_to_canister_id_map.iter();

    //     while iterator_over_map.has_next() {
    //         let (user_principal_id, canister_id): (SPrincipal, SPrincipal) =
    //             iterator_over_map.next().unwrap();
    //         canister_data
    //             .borrow_mut()
    //             .user_principal_id_to_canister_id_map
    //             .insert(user_principal_id.0, canister_id.0);
    //     }
    // });

    // // unique user name to user principal id map
    // let unique_user_name_to_user_principal_id_map = s!(UniqueUserNameToUserPrincipalIdMap);
    // CANISTER_DATA.with(|canister_data| {
    //     let mut iterator_over_map = unique_user_name_to_user_principal_id_map.iter();

    //     while iterator_over_map.has_next() {
    //         let (unique_user_name, user_principal_id): (String, SPrincipal) =
    //             iterator_over_map.next().unwrap();
    //         canister_data
    //             .borrow_mut()
    //             .unique_user_name_to_user_principal_id_map
    //             .insert(unique_user_name, user_principal_id.0);
    //     }
    // });
}

#[ic_cdk_macros::query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    export_service!();
    __export_service()
}
