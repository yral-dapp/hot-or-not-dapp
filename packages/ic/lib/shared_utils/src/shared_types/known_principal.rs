use std::collections::HashMap;

use candid::{CandidType, Deserialize};
use ic_stable_memory::utils::ic_types::SPrincipal;
use speedy::{Readable, Writable};

#[derive(CandidType, Deserialize, PartialEq, Eq, Hash, Readable, Writable, Clone)]
pub enum KnownPrincipalType {
    UserIdGlobalSuperAdmin,
    CanisterIdPostCache,
    CanisterIdUserIndex,
    CanisterIdRootCanister,
    CanisterIdTopicCacheIndex,
    CanisterIdSNSController,
}

pub type KnownPrincipalMap = HashMap<KnownPrincipalType, SPrincipal>;
