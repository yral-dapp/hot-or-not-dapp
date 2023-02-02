use ic_stable_memory::stable_memory_pre_upgrade;

#[ic_cdk_macros::pre_upgrade]
fn pre_upgrade() {
    // * save stable variables meta-info
    stable_memory_pre_upgrade();
}
