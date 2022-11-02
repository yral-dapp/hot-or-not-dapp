use candid::Principal;

use crate::shared_types::known_principal::{KnownPrincipalMap, KnownPrincipalType};

pub const DYNAMIC_CANISTER_DEFAULT_CREATION_BALANCE: u64 = 2_000_000_000_000; // 2T Cycles

pub const MAX_USERS_IN_FOLLOWER_FOLLOWING_LIST: u64 = 10000;
pub const MAX_POSTS_IN_ONE_REQUEST: u64 = 100;
pub const TOP_POSTS_SYNC_INTERVAL: u64 = 1_000_000_000 * 60 * 30; // 30 minutes
pub const SCORE_RECALCULATION_SYNC_INTERVAL: u64 = 1_000_000_000 * 60 * 60; // 60 minutes

// * Important Principal IDs

// * Global Owner Principal ID
pub fn get_global_super_admin_principal_id(well_known_canisters: KnownPrincipalMap) -> Principal {
    match option_env!("DFX_NETWORK") {
        Some("ic") => {
            Principal::from_text("7gaq2-4kttl-vtbt4-oo47w-igteo-cpk2k-57h3p-yioqe-wkawi-wz45g-jae")
                .unwrap()
        }
        _ => {
            well_known_canisters
                .get(&KnownPrincipalType::UserIdGlobalSuperAdmin)
                .expect("USER_ID_global_super_admin not found")
                .0
        }
    }
}

// * post_cache canister Principal ID
pub fn get_post_cache_canister_principal_id(well_known_canisters: KnownPrincipalMap) -> Principal {
    match option_env!("DFX_NETWORK") {
        Some("ic") => Principal::from_text("y6yjf-jyaaa-aaaal-qbd6q-cai").unwrap(),
        _ => {
            well_known_canisters
                .get(&KnownPrincipalType::CanisterIdPostCache)
                .expect("USER_ID_global_super_admin not found")
                .0
        }
    }
}

// * user_index canister Principal ID
pub fn get_user_index_canister_principal_id(well_known_canisters: KnownPrincipalMap) -> Principal {
    match option_env!("DFX_NETWORK") {
        Some("ic") => Principal::from_text("rimrc-piaaa-aaaao-aaljq-cai").unwrap(),
        _ => {
            well_known_canisters
                .get(&KnownPrincipalType::CanisterIdUserIndex)
                .expect("USER_ID_global_super_admin not found")
                .0
        }
    }
}

// * Canister WASMs
// pub const INDIVIDUAL_USER_TEMPLATE_CANISTER_WASM: &[u8] = include_bytes!(
//     "../../../../../target/wasm32-unknown-unknown/release/individual_user_template.wasm"
// );

// pub const USER_INDEX_CANISTER_WASM: &[u8] =
//     include_bytes!("../../../../../target/wasm32-unknown-unknown/release/user_index.wasm");

// pub const POST_CACHE_CANISTER_WASM: &[u8] =
//     include_bytes!("../../../../../target/wasm32-unknown-unknown/release/post_cache.wasm");
