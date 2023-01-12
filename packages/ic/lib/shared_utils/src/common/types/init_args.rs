use candid::{CandidType, Deserialize, Principal};

use super::known_principal::{KnownPrincipalMap, KnownPrincipalMapV1};

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

#[derive(Deserialize, CandidType, Default)]
pub struct PostCacheInitArgs {
    pub known_principal_ids: KnownPrincipalMapV1,
}
