use std::collections::HashMap;

use ic_stable_memory::{s, stable_memory_init};
use shared_utils::canister_specific::user_index::types::args::UserIndexInitArgs;

use crate::{
    data::{
        AccessControlMap, LastRunUpgradeStatus, MyKnownPrincipalIdsMap,
        UniqueUserNameToUserPrincipalIdMap, UserPrincipalIdToCanisterIdMap,
    },
    util::{access_control, known_principal_ids},
};

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
