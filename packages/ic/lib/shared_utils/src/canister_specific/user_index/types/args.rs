use candid::{CandidType, Deserialize};

use crate::common::types::known_principal::KnownPrincipalMapV1;

#[derive(Deserialize, CandidType, Default)]
pub struct UserIndexInitArgs {
    pub known_principal_ids: KnownPrincipalMapV1,
}
