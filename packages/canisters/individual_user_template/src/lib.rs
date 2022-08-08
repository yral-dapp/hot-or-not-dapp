use candid::{candid_method, export_service, Principal};
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, query};

use ic_stable_memory::{
    collections::vec::SVec, s, stable_memory_init, stable_memory_post_upgrade,
    stable_memory_pre_upgrade, utils::ic_types::SPrincipal,
};

#[cfg(test)]
mod test;

// * Stable Variables

// * Stable Collections
type AllowList = SVec<SPrincipal>;

#[init]
fn init() {
    // * initialize stable memory
    stable_memory_init(true, 0);

    // * initialize stable variables
    s!(AllowList = AllowList::new());
}

#[pre_upgrade]
fn pre_upgrade() {
    // * save stable variables meta-info
    stable_memory_pre_upgrade();
}

#[post_upgrade]
fn post_upgrade() {
    // * reinitialize stable memory and variables
    stable_memory_post_upgrade(0);
}

#[query]
#[candid_method(query)]
fn say_hello(greeting: String) -> String {
    format!("{} {}", greeting, "world")
}

#[query]
#[candid_method(query)]
fn return_my_principal() -> Principal {
    ic_cdk::caller()
}

#[query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    export_service!();
    __export_service()
}
