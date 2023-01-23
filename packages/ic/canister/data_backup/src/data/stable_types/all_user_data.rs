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
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(&bytes, Self).unwrap()
    }
}

impl BoundedStorable for AllUserData {
    // * 100 kB = 100_000 B
    const MAX_SIZE: u32 = 100_000;
    const IS_FIXED_SIZE: bool = false;
}

#[derive(Deserialize, CandidType, Default)]
pub struct UserOwnedCanisterData {
    pub unique_user_name: String,
}
