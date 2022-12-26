use std::collections::HashMap;

use candid::{CandidType, Deserialize, Principal};
use ic_stable_memory::utils::ic_types::SPrincipal;
use serde::Serialize;
use speedy::{Readable, Writable};

#[derive(CandidType, Deserialize, PartialEq, Eq, Hash, Readable, Writable, Clone, Serialize)]
pub enum KnownPrincipalType {
    UserIdGlobalSuperAdmin,
    CanisterIdPostCache,
    CanisterIdProjectMemberIndex,
    CanisterIdRootCanister,
    CanisterIdSNSController,
    CanisterIdTopicCacheIndex,
    CanisterIdUserIndex,
    CanisterIdConfiguration,
    CanisterIdDataBackup,
}

// TODO: Migrate implementers to V1
pub type KnownPrincipalMap = HashMap<KnownPrincipalType, SPrincipal>;
pub type KnownPrincipalMapV1 = HashMap<KnownPrincipalType, Principal>;
