use std::{collections::BTreeMap, time::SystemTime};

use shared_utils::{
    date_time::get_current_system_time::get_current_system_time_from_ic,
    shared_types::utility_token::TokenEvent,
};
use speedy::{Readable, Writable};

#[derive(Readable, Writable, Default)]
pub struct TokenBalance {
    utility_token_balance: u64,
    utility_token_transaction_history: BTreeMap<SystemTime, TokenEvent>,
}

impl TokenBalance {
    pub fn get_utility_token_balance(&self) -> u64 {
        self.utility_token_balance
    }

    pub fn handle_token_event(mut self, token_event: TokenEvent) -> Self {
        self.utility_token_balance += token_event.get_token_amount_for_token_event();

        if self.utility_token_transaction_history.len() > 1500 {
            self.utility_token_transaction_history = self
                .utility_token_transaction_history
                .into_iter()
                .rev()
                .take(1000)
                .rev()
                .collect();
        }

        self.utility_token_transaction_history
            .insert(get_current_system_time_from_ic(), token_event);

        self
    }

    pub fn get_utility_token_transaction_history(&self) -> &BTreeMap<SystemTime, TokenEvent> {
        &self.utility_token_transaction_history
    }
}
