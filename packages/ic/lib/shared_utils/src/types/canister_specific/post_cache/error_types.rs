use candid::{CandidType, Deserialize};

#[derive(CandidType, Deserialize, Debug)]
pub enum TopPostsFetchError {
    InvalidBoundsPassed,
    ReachedEndOfItemsList,
    ExceededMaxNumberOfItemsAllowedInOneRequest,
}
