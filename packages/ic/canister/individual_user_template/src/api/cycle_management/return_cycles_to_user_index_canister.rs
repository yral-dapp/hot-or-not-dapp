use ic_cdk::api::management_canister::{main, provisional::CanisterIdRecord};
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::{
    access_control::{self, UserAccessRole},
    constant::{get_user_index_canister_principal_id, RECHARGE_CYCLES_AMOUNT},
};

use crate::data_model::{AccessControlMap, MyKnownPrincipalIdsMap};

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn return_cycles_to_user_index_canister() {
    let request_maker = ic_cdk::caller();
    let user_id_access_control_map = s!(AccessControlMap);
    assert!(access_control::does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::CanisterAdmin,
        SPrincipal(request_maker)
    ));

    let known_principal_ids = s!(MyKnownPrincipalIdsMap);
    main::deposit_cycles(
        CanisterIdRecord {
            canister_id: get_user_index_canister_principal_id(known_principal_ids),
        },
        RECHARGE_CYCLES_AMOUNT,
    )
    .await
    .unwrap();
}
