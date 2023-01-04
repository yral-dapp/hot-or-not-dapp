use std::collections::HashMap;

use candid::{CandidType, Deserialize, Principal};
use ic_stable_memory::{collections::hash_map::SHashMap, utils::ic_types::SPrincipal};
use shared_utils::{
    access_control::UserAccessRole, common::types::known_principal::KnownPrincipalMap,
};

use self::canister_upgrade::upgrade_status::UpgradeStatus;

pub mod canister_upgrade;

// * Stable Variables
pub type LastRunUpgradeStatus = UpgradeStatus;
pub type MyKnownPrincipalIdsMap = KnownPrincipalMap;

// * Stable collections
pub type UserPrincipalIdToCanisterIdMap = SHashMap<SPrincipal, SPrincipal>;
pub type UniqueUserNameToUserPrincipalIdMap = SHashMap<String, SPrincipal>;
pub type AccessControlMap = SHashMap<SPrincipal, Vec<UserAccessRole>>;

#[derive(Default, CandidType, Deserialize)]
pub struct CanisterData {
    pub last_run_upgrade_status: UpgradeStatus,
    pub my_known_principal_ids_map: KnownPrincipalMap,
    pub access_control_map: HashMap<Principal, Vec<UserAccessRole>>,
    pub user_principal_id_to_canister_id_map: HashMap<Principal, Principal>,
    pub unique_user_name_to_user_principal_id_map: HashMap<String, Principal>,
}
