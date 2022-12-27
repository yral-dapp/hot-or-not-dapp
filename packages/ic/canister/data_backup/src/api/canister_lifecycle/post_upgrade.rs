use ic_cdk::storage;

use crate::CANISTER_DATA;

use super::pre_upgrade;

#[ic_cdk_macros::post_upgrade]
fn post_upgrade() {
    match storage::stable_restore() {
        Ok((canister_data,)) => {
            CANISTER_DATA.with(|canister_data_ref_cell| {
                (*canister_data_ref_cell.borrow_mut()).heap_data = canister_data;
            });
        }
        Err(_) => {
            panic!("Failed to restore canister data from stable memory");
        }
    }

    pre_upgrade::pre_upgrade();
}
