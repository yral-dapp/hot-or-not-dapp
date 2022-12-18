use std::collections::HashMap;

use candid::{CandidType, Deserialize, Principal};
use shared_utils::{access_control::UserAccessRole, types::known_principal::KnownPrincipalMapV1};

#[derive(Default, CandidType, Deserialize)]
pub struct CanisterData {
    pub my_known_principal_ids_map: KnownPrincipalMapV1,
    pub access_control_map: HashMap<Principal, Vec<UserAccessRole>>,
}
