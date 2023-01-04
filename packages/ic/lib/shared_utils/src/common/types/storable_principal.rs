use std::borrow::Cow;

use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_stable_structures::{BoundedStorable, Storable};

const STORABLE_PRINCIPAL_MAX_SIZE: u32 = 32;

#[derive(CandidType, Deserialize)]
pub struct StorablePrincipal(pub Principal);

impl Storable for StorablePrincipal {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Vec<u8>) -> Self {
        Decode!(&bytes, Self).unwrap()
    }
}

impl BoundedStorable for StorablePrincipal {
    fn max_size() -> u32 {
        STORABLE_PRINCIPAL_MAX_SIZE
    }
}
