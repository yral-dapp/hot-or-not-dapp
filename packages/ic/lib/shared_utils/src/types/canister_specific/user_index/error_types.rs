use candid::{CandidType, Deserialize};

#[derive(CandidType, Deserialize, Debug)]
pub enum SetUniqueUsernameError {
    UsernameAlreadyTaken,
    SendingCanisterDoesNotMatchUserCanisterId,
    UserCanisterEntryDoesNotExist,
}
