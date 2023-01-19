use candid::{CandidType, Deserialize, Principal};

use crate::common::types::known_principal::KnownPrincipalMap;

#[derive(Deserialize, CandidType)]
pub struct IndividualUserTemplateInitArgs {
    pub known_principal_ids: KnownPrincipalMap,
    pub profile_owner: Principal,
}

impl IndividualUserTemplateInitArgs {
    pub fn new(profile_owner: Principal) -> Self {
        Self {
            known_principal_ids: KnownPrincipalMap::default(),
            profile_owner,
        }
    }
}
