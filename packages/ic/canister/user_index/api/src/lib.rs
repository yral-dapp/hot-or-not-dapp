use std::collections::HashMap;

use candid::{export_service, Principal};
use ic_cdk::api::call;
use ic_stable_memory::{
    s, stable_memory_init, stable_memory_post_upgrade, stable_memory_pre_upgrade,
};
use shared_utils::{
    access_control::UserAccessRole,
    shared_types::{
        individual_user_template::error_types::UpdateProfileSetUniqueUsernameError,
        init_args::UserIndexInitArgs, user_index::error_types::SetUniqueUsernameError,
    },
};
use user_index_lib::{
    model::upgrade_status::UpgradeStatus,
    util::{access_control, known_principal_ids},
    AccessControlMap, LastRunUpgradeStatus, MyKnownPrincipalIdsMap,
    UniqueUserNameToUserPrincipalIdMap, UserPrincipalIdToCanisterIdMap,
};

mod api;
#[cfg(test)]
mod test;

#[ic_cdk_macros::init]
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

    // TODO: remove after first run
    s! { MyKnownPrincipalIdsMap = HashMap::new() }
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn ask_individual_canisters_to_send_me_their_unique_username_if_set(
) -> Result<(), UpdateProfileSetUniqueUsernameError> {
    let user_principal_id_to_canister_id_map: UserPrincipalIdToCanisterIdMap =
        s!(UserPrincipalIdToCanisterIdMap);

    let mut iterator_over_map = user_principal_id_to_canister_id_map.iter();

    while iterator_over_map.has_next() {
        let (_user_principal_id, user_canister_id) = iterator_over_map.next().unwrap();

        let (_response,): (Result<(), UpdateProfileSetUniqueUsernameError>,) = call::call(
            user_canister_id.0,
            "update_profile_resend_username_to_user_index_canister",
            (),
        )
        .await
        .map_err(|_| UpdateProfileSetUniqueUsernameError::UserIndexCrossCanisterCallFailed)?;
    }

    Ok(())
}

#[ic_cdk_macros::query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    export_service!();
    __export_service()
}
