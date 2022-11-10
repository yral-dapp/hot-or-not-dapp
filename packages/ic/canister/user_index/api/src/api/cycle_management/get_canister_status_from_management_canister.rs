use candid::Principal;
use ic_cdk::api::management_canister::{
    main::{self, CanisterStatusResponse},
    provisional::CanisterIdRecord,
};
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::access_control::{self, UserAccessRole};
use user_index_lib::AccessControlMap;

// TODO: move this to the individual canisters
// TODO: Do this by calling this via the user_index canister
// TODO: Also investigate why global principal is unable to call this. Are we not setting global principal as a controller when provisioning this canister?
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn get_canister_status_from_management_canister(
    canister_id: Principal,
) -> CanisterStatusResponse {
    let request_maker = ic_cdk::caller();
    let user_id_access_control_map: AccessControlMap = s!(AccessControlMap);
    assert!(access_control::does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::CanisterAdmin,
        SPrincipal(request_maker)
    ));

    let (response,): (CanisterStatusResponse,) =
        main::canister_status(CanisterIdRecord { canister_id })
            .await
            .unwrap();

    response
}
