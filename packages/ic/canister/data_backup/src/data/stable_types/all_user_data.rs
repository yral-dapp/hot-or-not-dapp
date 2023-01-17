use std::borrow::Cow;

use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_stable_structures::{BoundedStorable, Storable};

#[derive(CandidType, Deserialize)]
pub struct AllUserData {
    pub user_principal_id: Principal,
    pub user_canister_id: Principal,
    pub canister_data: UserOwnedCanisterData,
}

impl Storable for AllUserData {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Vec<u8>) -> Self {
        Decode!(&bytes, Self).unwrap()
    }
}

// * 100 kB = 100_000 B
const ALL_USER_DATA_MAX_SIZE: u32 = 100_000;

impl BoundedStorable for AllUserData {
    fn max_size() -> u32 {
        ALL_USER_DATA_MAX_SIZE
    }
}

#[derive(Deserialize, CandidType, Default)]
pub struct UserOwnedCanisterData {
    pub unique_user_name: String,
}
