use candid::{CandidType, Deserialize};

#[derive(CandidType, Deserialize)]
pub enum SetUniqueUsernameError {
    UsernameAlreadyTaken,
    SendingCanisterDoesNotMatchUserCanisterId,
    UserCanisterEntryDoesNotExist,
}
