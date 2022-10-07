use candid::Principal;

pub const DYNAMIC_CANISTER_DEFAULT_CREATION_BALANCE: u64 = 2_000_000_000_000; // 2T Cycles

pub const MAX_USERS_IN_FOLLOWER_FOLLOWING_LIST: u64 = 1000;
pub const MAX_POSTS_IN_ONE_REQUEST: u64 = 100;
pub const TOP_POSTS_SYNC_INTERVAL: u64 = 1_000_000_000 * 60 * 30; // 30 minutes

// * Important Principal IDs

// * Global Owner Principal ID
pub fn get_global_owner_principal_id() -> Principal {
    Principal::from_text(
        option_env!("GLOBAL_OWNER_PRINCIPAL_ID")
            .unwrap_or("7gaq2-4kttl-vtbt4-oo47w-igteo-cpk2k-57h3p-yioqe-wkawi-wz45g-jae"),
    )
    .unwrap()
}

// * post_cache canister Principal ID
pub fn get_post_cache_canister_principal_id() -> Principal {
    Principal::from_text(
        option_env!("CANISTER_ID_post_cache").unwrap_or("y6yjf-jyaaa-aaaal-qbd6q-cai"),
    )
    .unwrap()
}

// * user_index canister Principal ID
pub fn get_user_index_canister_principal_id() -> Principal {
    Principal::from_text(
        option_env!("CANISTER_ID_user_index").unwrap_or("rimrc-piaaa-aaaao-aaljq-cai"),
    )
    .unwrap()
}
