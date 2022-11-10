use candid::{CandidType, Deserialize};

#[derive(CandidType, Debug, Deserialize)]
pub enum GetUserUtilityTokenTransactionHistoryError {
    InvalidBoundsPassed,
    ReachedEndOfItemsList,
    ExceededMaxNumberOfItemsAllowedInOneRequest,
}
