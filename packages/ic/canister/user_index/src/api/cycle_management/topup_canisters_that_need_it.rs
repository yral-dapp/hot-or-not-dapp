use ic_cdk::api::management_canister::{
    main::{self, CanisterStatusResponse},
    provisional::CanisterIdRecord,
};
use shared_utils::{
    access_control::{self, UserAccessRole},
    constant::{CYCLES_THRESHOLD_TO_INITIATE_RECHARGE, RECHARGE_CYCLES_AMOUNT},
};

use crate::CANISTER_DATA;

// TODO: Convert this to a daily cron job that is then moved to individual canisters
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn topup_canisters_that_need_it() {
    let api_caller = ic_cdk::caller();

    let access_control_map = CANISTER_DATA
        .with(|canister_data_ref_cell| canister_data_ref_cell.borrow().access_control_map.clone());

    if !access_control::does_principal_have_role_v2(
        &access_control_map,
        UserAccessRole::CanisterAdmin,
        api_caller,
    ) {
        return;
    };

    let user_principal_id_to_canister_id_map = CANISTER_DATA.with(|canister_data_ref_cell| {
        canister_data_ref_cell
            .borrow()
            .user_principal_id_to_canister_id_map
            .clone()
    });

    for (_user_principal_id, user_canister_id) in user_principal_id_to_canister_id_map.iter() {
        let (response,): (CanisterStatusResponse,) = main::canister_status(CanisterIdRecord {
            canister_id: user_canister_id.clone(),
        })
        .await
        .unwrap();

        if response.cycles < CYCLES_THRESHOLD_TO_INITIATE_RECHARGE {
            main::deposit_cycles(
                CanisterIdRecord {
                    canister_id: user_canister_id.clone(),
                },
                RECHARGE_CYCLES_AMOUNT,
            )
            .await
            .unwrap();
        }
    }
}
