use candid::CandidType;

#[derive(CandidType)]
pub enum TopPostsFetchError {
    InvalidBoundsPassed,
    ReachedEndOfItemsList,
    ExceededMaxNumberOfItemsAllowedInOneRequest,
}
