use std::time::SystemTime;

use ic_stable_memory::s;
use individual_user_template_lib::{
    model::api_error::GetUserUtilityTokenTransactionHistoryError, MyTokenBalance,
};
use shared_utils::{
    pagination::{self, PaginationError},
    shared_types::utility_token::TokenEvent,
};

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_user_utility_token_transaction_history_with_pagination(
    from_inclusive_id: u64,
    to_exclusive_id: u64,
) -> Result<Vec<(SystemTime, TokenEvent)>, GetUserUtilityTokenTransactionHistoryError> {
    let my_token_balance: MyTokenBalance = s!(MyTokenBalance);

    let (from_inclusive_id, to_exclusive_id) = pagination::get_pagination_bounds(
        from_inclusive_id,
        to_exclusive_id,
        my_token_balance
            .get_utility_token_transaction_history()
            .len() as u64,
    )
    .map_err(|e| match e {
        PaginationError::InvalidBoundsPassed => {
            GetUserUtilityTokenTransactionHistoryError::InvalidBoundsPassed
        }
        PaginationError::ReachedEndOfItemsList => {
            GetUserUtilityTokenTransactionHistoryError::ReachedEndOfItemsList
        }
        PaginationError::ExceededMaxNumberOfItemsAllowedInOneRequest => {
            GetUserUtilityTokenTransactionHistoryError::ExceededMaxNumberOfItemsAllowedInOneRequest
        }
    })?;

    Ok(my_token_balance
        .get_utility_token_transaction_history()
        .iter()
        .skip(from_inclusive_id as usize)
        .take((to_exclusive_id - from_inclusive_id) as usize)
        .map(|(time, token_event)| (*time, token_event.clone()))
        .collect())
}
