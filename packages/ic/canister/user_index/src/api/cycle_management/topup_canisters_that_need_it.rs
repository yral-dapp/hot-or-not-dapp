use ic_cdk::api::management_canister::{
    main::{self, CanisterStatusResponse},
    provisional::CanisterIdRecord,
};
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::{
    access_control::{self, UserAccessRole},
    constant::{CYCLES_THRESHOLD_TO_INITIATE_RECHARGE, RECHARGE_CYCLES_AMOUNT},
};

use crate::data::{AccessControlMap, UserPrincipalIdToCanisterIdMap};

// TODO: Convert this to a daily cron job that is then moved to individual canisters
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn topup_canisters_that_need_it() {
    let request_maker = ic_cdk::caller();
    let user_id_access_control_map: AccessControlMap = s!(AccessControlMap);
    assert!(access_control::does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::CanisterAdmin,
        SPrincipal(request_maker)
    ));

    let user_principal_id_to_canister_id_map: UserPrincipalIdToCanisterIdMap =
        s!(UserPrincipalIdToCanisterIdMap);

    let mut iterator_over_map = user_principal_id_to_canister_id_map.iter();

    while iterator_over_map.has_next() {
        let (_user_principal_id, user_canister_id) = iterator_over_map.next().unwrap();

        let (response,): (CanisterStatusResponse,) = main::canister_status(CanisterIdRecord {
            canister_id: user_canister_id.0,
        })
        .await
        .unwrap();

        if response.cycles < CYCLES_THRESHOLD_TO_INITIATE_RECHARGE {
            main::deposit_cycles(
                CanisterIdRecord {
                    canister_id: user_canister_id.0,
                },
                RECHARGE_CYCLES_AMOUNT,
            )
            .await
            .unwrap();
        }
    }
}
