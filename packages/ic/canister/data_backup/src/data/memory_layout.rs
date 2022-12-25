use std::cell::RefCell;

use candid::{CandidType, Deserialize};
use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    DefaultMemoryImpl,
};
use serde::Serialize;

use super::heap_data::HeapData;

thread_local! {
  static MEMORY_MANANGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
}

#[derive(Default, Deserialize, CandidType, Serialize)]
pub struct CanisterData {
    pub heap_data: HeapData,
}

pub type Memory = VirtualMemory<DefaultMemoryImpl>;

// * Heap data memory.
const HEAP_DATA: MemoryId = MemoryId::new(0);
pub fn get_heap_data_memory() -> Memory {
    MEMORY_MANANGER
        .with(|memory_manager_ref_cell| memory_manager_ref_cell.borrow_mut().get(HEAP_DATA))
}
