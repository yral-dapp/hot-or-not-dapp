use crate::LastRunUpgradeStatus;
use ic_stable_memory::s;

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_index_details_last_upgrade_status() -> LastRunUpgradeStatus {
    s!(LastRunUpgradeStatus)
}
