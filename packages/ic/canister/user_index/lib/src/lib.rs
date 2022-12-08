use ic_stable_memory::{collections::hash_map::SHashMap, utils::ic_types::SPrincipal};
use model::upgrade_status::UpgradeStatus;
use shared_utils::{access_control::UserAccessRole, types::known_principal::KnownPrincipalMap};

pub mod model;
pub mod util;

// * Stable Variables
pub type LastRunUpgradeStatus = UpgradeStatus;
pub type MyKnownPrincipalIdsMap = KnownPrincipalMap;

// * Stable collections
pub type UserPrincipalIdToCanisterIdMap = SHashMap<SPrincipal, SPrincipal>;
pub type UniqueUserNameToUserPrincipalIdMap = SHashMap<String, SPrincipal>;
pub type AccessControlMap = SHashMap<SPrincipal, Vec<UserAccessRole>>;
