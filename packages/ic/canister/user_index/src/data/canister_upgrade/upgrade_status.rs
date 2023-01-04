use std::time::SystemTime;

use candid::{CandidType, Deserialize};
use ic_stable_memory::utils::ic_types::SPrincipal;
use shared_utils::date_time::system_time;
use speedy::{Readable, Writable};

#[derive(CandidType, Readable, Writable, Deserialize)]
pub struct UpgradeStatus {
    pub version_number: u64,
    pub last_run_on: SystemTime,
    pub successful_upgrade_count: u32,
    pub failed_canister_ids: Vec<(SPrincipal, SPrincipal)>,
}

impl Default for UpgradeStatus {
    fn default() -> Self {
        Self::new()
    }
}

impl UpgradeStatus {
    pub fn new() -> Self {
        Self {
            version_number: 0,
            last_run_on: system_time::get_current_system_time_from_ic(),
            successful_upgrade_count: 0,
            failed_canister_ids: Vec::new(),
        }
    }
}