use candid::{CandidType, Deserialize};
use ic_stable_memory::utils::ic_types::SPrincipal;
use speedy::{Readable, Writable};
use std::cmp::Ordering;

#[derive(Readable, Writable, Eq, Clone, CandidType, Deserialize, Debug)]
pub struct PostScoreIndexItem {
    pub score: u64,
    pub post_id: u64,
    pub publisher_canister_id: SPrincipal,
}

impl Ord for PostScoreIndexItem {
    fn cmp(&self, other: &Self) -> Ordering {
        match other.publisher_canister_id.cmp(&self.publisher_canister_id) {
            Ordering::Equal => match other.post_id.cmp(&self.post_id) {
                Ordering::Equal => Ordering::Equal,
                _ => match other.score.cmp(&self.score) {
                    Ordering::Greater => Ordering::Greater,
                    Ordering::Less => Ordering::Less,
                    Ordering::Equal => match other.post_id.cmp(&self.post_id) {
                        Ordering::Greater => Ordering::Greater,
                        Ordering::Less => Ordering::Less,
                        Ordering::Equal => Ordering::Equal,
                    },
                },
            },
            _ => match other.score.cmp(&self.score) {
                Ordering::Greater => Ordering::Greater,
                Ordering::Less => Ordering::Less,
                Ordering::Equal => match other.post_id.cmp(&self.post_id) {
                    Ordering::Greater => Ordering::Greater,
                    Ordering::Less => Ordering::Less,
                    Ordering::Equal => {
                        match other.publisher_canister_id.cmp(&self.publisher_canister_id) {
                            Ordering::Greater => Ordering::Greater,
                            Ordering::Less => Ordering::Less,
                            Ordering::Equal => Ordering::Equal,
                        }
                    }
                },
            },
        }
    }
}

impl PartialOrd for PostScoreIndexItem {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        match other.publisher_canister_id.cmp(&self.publisher_canister_id) {
            Ordering::Equal => match other.post_id.cmp(&self.post_id) {
                Ordering::Equal => Some(Ordering::Equal),
                _ => match other.score.cmp(&self.score) {
                    Ordering::Greater => Some(Ordering::Greater),
                    Ordering::Less => Some(Ordering::Less),
                    Ordering::Equal => match other.post_id.cmp(&self.post_id) {
                        Ordering::Greater => Some(Ordering::Greater),
                        Ordering::Less => Some(Ordering::Less),
                        Ordering::Equal => Some(Ordering::Equal),
                    },
                },
            },
            _ => match other.score.cmp(&self.score) {
                Ordering::Greater => Some(Ordering::Greater),
                Ordering::Less => Some(Ordering::Less),
                Ordering::Equal => match other.post_id.cmp(&self.post_id) {
                    Ordering::Greater => Some(Ordering::Greater),
                    Ordering::Less => Some(Ordering::Less),
                    Ordering::Equal => {
                        match other.publisher_canister_id.cmp(&self.publisher_canister_id) {
                            Ordering::Greater => Some(Ordering::Greater),
                            Ordering::Less => Some(Ordering::Less),
                            Ordering::Equal => Some(Ordering::Equal),
                        }
                    }
                },
            },
        }
    }
}

impl PartialEq for PostScoreIndexItem {
    fn eq(&self, other: &Self) -> bool {
        self.publisher_canister_id == other.publisher_canister_id && self.post_id == other.post_id
    }
}
