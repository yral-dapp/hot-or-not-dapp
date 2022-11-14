use crate::UserPrincipalIdToCanisterIdMap;
use candid::Principal;
use ic_cdk::api::call;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use user_index_lib::util::canister_management::create_users_canister;

#[deprecated = "Use get_requester_principals_canister_id_create_if_not_exists_and_optionally_allow_referrer instead. This function does not support referrals"]
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn get_user_index_create_if_not_exists_else_return_canister_id_for_embedded_user_principal_id(
) -> Principal {
    let user_id = SPrincipal(ic_cdk::caller());

    let mut user_id_to_canister_id_map = s!(UserPrincipalIdToCanisterIdMap);

    match user_id_to_canister_id_map.get_cloned(&user_id) {
        Some(canister_id) => canister_id.0,
        None => {
            let created_canister_id = create_users_canister(user_id.0).await;

            user_id_to_canister_id_map.insert(user_id, &SPrincipal(created_canister_id));
            s! { UserPrincipalIdToCanisterIdMap = user_id_to_canister_id_map };

            let (): () = call::call(created_canister_id, "get_rewarded_for_signing_up", ())
                .await
                .unwrap();

            created_canister_id
        }
    }
}
