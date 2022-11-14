use std::{collections::BTreeMap, time::SystemTime};

use shared_utils::shared_types::utility_token::{v0::TokenEvent, v1::TokenEventV1};
use speedy::{Readable, Writable};

#[derive(Readable, Writable, Default)]
pub struct TokenBalance {
    utility_token_balance: u64,
    utility_token_transaction_history: BTreeMap<SystemTime, TokenEvent>,
    utility_token_transaction_history_v1: BTreeMap<u64, TokenEventV1>,
}

impl TokenBalance {
    pub fn get_utility_token_balance(&self) -> u64 {
        self.utility_token_balance
    }

    pub fn get_utility_token_transaction_history(&self) -> &BTreeMap<u64, TokenEventV1> {
        &self.utility_token_transaction_history_v1
    }

    pub fn handle_token_event(mut self, token_event: TokenEventV1) -> Self {
        self.utility_token_balance += token_event.get_token_amount_for_token_event();

        if self.utility_token_transaction_history_v1.len() > 1500 {
            self.utility_token_transaction_history_v1 = self
                .utility_token_transaction_history_v1
                .into_iter()
                .rev()
                .take(1000)
                .rev()
                .collect();
        }

        self.utility_token_transaction_history_v1.insert(
            self.utility_token_transaction_history_v1.len() as u64,
            token_event,
        );

        self
    }
}
