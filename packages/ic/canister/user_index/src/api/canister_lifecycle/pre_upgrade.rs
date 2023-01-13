#[ic_cdk_macros::pre_upgrade]
pub fn pre_upgrade() {
    // * save stable variables meta-info
    ic_stable_memory::stable_memory_pre_upgrade();
}
