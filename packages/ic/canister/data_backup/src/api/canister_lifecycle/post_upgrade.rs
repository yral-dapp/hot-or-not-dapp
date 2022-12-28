use ciborium::de;
use ic_stable_structures::Memory;

use crate::{data::memory_layout, CANISTER_DATA};

use super::pre_upgrade;

#[ic_cdk_macros::post_upgrade]
fn post_upgrade() {
    let heap_data = memory_layout::get_heap_data_memory();

    // * Read the length of the heap data state.
    // * Since heap can be at max 4 GiB, 4 bytes are enough to store the length.
    let mut heap_data_len_bytes = [0; 4];
    heap_data.read(0, &mut heap_data_len_bytes);
    let heap_data_len = u32::from_le_bytes(heap_data_len_bytes) as usize;

    // * Read the canister data state.
    let mut canister_data_bytes = vec![0; heap_data_len];
    heap_data.read(4, &mut canister_data_bytes);

    // * Deserialize the canister data state.
    let canister_data =
        de::from_reader(&*canister_data_bytes).expect("Failed to deserialize heap data");
    CANISTER_DATA.with(|canister_data_ref_cell| {
        *canister_data_ref_cell.borrow_mut() = canister_data;
    });

    pre_upgrade::pre_upgrade();
}
