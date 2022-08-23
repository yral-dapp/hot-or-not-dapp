use candid::{candid_method, export_service, Principal};
use canister_create::create_users_canister;
use ic_cdk::caller;
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, query, update};
use ic_stable_memory::{
    collections::hash_map::SHashMap, s, stable_memory_init, stable_memory_post_upgrade,
    stable_memory_pre_upgrade, utils::ic_types::SPrincipal,
};

mod canister_create;
mod constant;
#[cfg(test)]
mod test;

// * Stable Variables

// * Stable collections
type UserIdToCanisterIdMap = SHashMap<SPrincipal, SPrincipal>;

#[init]
fn init() {
    // * initialize stable memory
    stable_memory_init(true, 0);

    // * initialize stable variables
    s! { UserIdToCanisterIdMap = UserIdToCanisterIdMap::new_with_capacity(200_000) };
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

// TODO: remove this before deployment to mainnet
#[update]
#[candid_method(update)]
fn __comment_this_reset_user_canisters() {
    s! { UserIdToCanisterIdMap = UserIdToCanisterIdMap::new() };
}

#[update]
#[candid_method(update)]
async fn get_users_canister() -> Principal {
    let user_id = SPrincipal(caller());

    let mut user_id_to_canister_id_map = s!(UserIdToCanisterIdMap);

    eprintln!("{:?}", user_id);

    match user_id_to_canister_id_map.get_cloned(&user_id) {
        Some(canister_id) => canister_id.0,
        None => {
            let created_canister_id = create_users_canister().await;

            user_id_to_canister_id_map.insert(user_id, &SPrincipal(created_canister_id));
            s! { UserIdToCanisterIdMap = user_id_to_canister_id_map };
            //     .expect("User index canister is full. Please rectify")
            //     .unwrap();

            // s!(UserIdToCanisterIdMap = user_id_to_canister_id_map)
            //     .expect("Unable to save newly created canister ID");

            created_canister_id
        }
    }
}

#[query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    export_service!();
    __export_service()
}
