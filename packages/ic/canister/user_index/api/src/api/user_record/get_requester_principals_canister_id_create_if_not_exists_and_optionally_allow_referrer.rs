use crate::UserPrincipalIdToCanisterIdMap;
use candid::Principal;
use ic_cdk::api::call;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use user_index_lib::util::canister_management::create_users_canister;

// TODO: ignore anonymous principal
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn get_requester_principals_canister_id_create_if_not_exists_and_optionally_allow_referrer(
    referrer: Option<Principal>,
) -> Principal {
    let user_id = SPrincipal(ic_cdk::caller());

    let mut user_id_to_canister_id_map = s!(UserPrincipalIdToCanisterIdMap);

    match user_id_to_canister_id_map.get_cloned(&user_id) {
        // * canister already exists
        Some(canister_id) => canister_id.0,
        // * create new canister
        None => {
            let created_canister_id = create_users_canister(user_id.0).await;

            user_id_to_canister_id_map.insert(user_id, &SPrincipal(created_canister_id));
            s! { UserPrincipalIdToCanisterIdMap = user_id_to_canister_id_map };

            // * reward user for signing up
            call::notify(created_canister_id, "get_rewarded_for_signing_up", ()).ok();

            // * reward referrer for referring
            if let Some(referrer_principal_id) = referrer {
                if let Some(referrer_canister_id) =
                    user_id_to_canister_id_map.get_cloned(&SPrincipal(referrer_principal_id))
                {
                    call::notify(
                        referrer_canister_id.0,
                        "get_rewarded_for_referral",
                        (referrer_principal_id, user_id.0),
                    )
                    .ok();
                    call::notify(
                        created_canister_id,
                        "get_rewarded_for_referral",
                        (referrer_principal_id, user_id.0),
                    )
                    .ok();
                }
            }

            created_canister_id
        }
    }
}
