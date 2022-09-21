use access_control::util::setup_initial_access_control;
use candid::{export_service, Principal};
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, query};
use ic_stable_memory::{
    collections::hash_map::SHashMap, s, stable_memory_init, stable_memory_post_upgrade,
    stable_memory_pre_upgrade, utils::ic_types::SPrincipal,
};
use shared_utils::{
    access_control::UserAccessRole, shared_types::user_index::error_types::SetUniqueUsernameError,
};

mod access_control;
#[cfg(test)]
mod test;
mod user_index;

// * Stable Variables

// * Stable collections
pub type UserPrincipalIdToCanisterIdMap = SHashMap<SPrincipal, SPrincipal>;
pub type UniqueUserNameToUserPrincipalIdMap = SHashMap<String, SPrincipal>;
pub type AccessControlMap = SHashMap<SPrincipal, Vec<UserAccessRole>>;

#[init]
fn init() {
    // * initialize stable memory
    stable_memory_init(true, 0);

    // * initialize stable variables
    s! { UserPrincipalIdToCanisterIdMap = UserPrincipalIdToCanisterIdMap::new_with_capacity(200_000) };
    s! { UniqueUserNameToUserPrincipalIdMap = UniqueUserNameToUserPrincipalIdMap::new_with_capacity(100_000) };
    s! { AccessControlMap = AccessControlMap::new_with_capacity(100) };

    // * initialize access control
    let mut user_id_access_control_map = s!(AccessControlMap);
    setup_initial_access_control(&mut user_id_access_control_map);
    s! { AccessControlMap = user_id_access_control_map };
}

#[pre_upgrade]
fn pre_upgrade() {
    // * save stable variables meta-info
    stable_memory_pre_upgrade();
}

#[post_upgrade]
fn post_upgrade() {
    // * reinitialize stable memory and variables
    stable_memory_post_upgrade(0);
}

#[query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    export_service!();
    __export_service()
}
