use std::time::SystemTime;

use candid::CandidType;
use ic_stable_memory::utils::ic_types::SPrincipal;
use speedy::{Readable, Writable};

#[cfg(not(test))]
use shared_utils::date_time::system_time::for_prod::get_current_system_time;
#[cfg(test)]
use shared_utils::date_time::system_time::for_tests::get_current_system_time;

#[derive(CandidType, Readable, Writable)]
pub struct UpgradeStatus {
    pub version_number: u64,
    pub last_run_on: SystemTime,
    pub successful_upgrade_count: u32,
    pub failed_canister_ids: Vec<(SPrincipal, SPrincipal)>,
}

impl UpgradeStatus {
    pub fn new() -> Self {
        Self {
            version_number: 0,
            last_run_on: get_current_system_time(),
            successful_upgrade_count: 0,
            failed_canister_ids: Vec::new(),
        }
    }
}
