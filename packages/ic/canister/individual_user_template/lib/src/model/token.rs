use speedy::{Readable, Writable};

#[derive(Readable, Writable, Default)]
pub struct UserAccountTokenDetails {
    pub utility_token_balance: u64,
}
