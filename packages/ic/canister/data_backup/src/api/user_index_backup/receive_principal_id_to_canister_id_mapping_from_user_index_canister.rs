use candid::Principal;
use ic_stable_structures::StableBTreeMap;
use shared_utils::common::{
    types::{known_principal::KnownPrincipalType, storable_principal::StorablePrincipal},
    utils::well_known_principals::{
        get_canister_principal_id, get_canister_principal_id_from_configuration_canister,
    },
};

use crate::{data::memory_layout::Memory, CANISTER_DATA};

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn receive_principal_id_to_canister_id_mapping_from_user_index_canister(
    user_principal_id: Principal,
    canister_principal_id: Principal,
) {
    // * Get the known principal IDs.
    let mut known_principal_ids = CANISTER_DATA.with(|canister_data_ref_cell| {
        canister_data_ref_cell
            .borrow()
            .heap_data
            .known_principal_ids
            .clone()
    });

    // * Check if the sending principal is the User Index Canister.
    // * Return early if it is not.
    let caller_principal_id = ic_cdk::caller();

    // * Get the User Index Canister principal ID.
    let user_index_canister_principal_id = get_canister_principal_id(
        &mut known_principal_ids,
        KnownPrincipalType::CanisterIdUserIndex,
        &get_canister_principal_id_from_configuration_canister,
    )
    .await;

    // * Update the known principal IDs.
    CANISTER_DATA.with(|canister_data_ref_cell| {
        canister_data_ref_cell
            .borrow_mut()
            .heap_data
            .known_principal_ids = known_principal_ids;
    });

    // * Return early if the caller is not the User Index Canister.
    if caller_principal_id != user_index_canister_principal_id {
        return;
    };

    // * Update the mapping sent from the User Index Canister.
    CANISTER_DATA.with(|canister_data_ref_cell| {
        let mut user_principal_id_to_canister_principal_id_map = &mut canister_data_ref_cell
            .borrow_mut()
            .user_principal_id_to_canister_principal_id_map;

        receive_principal_id_to_canister_id_mapping_from_user_index_canister_impl(
            &mut user_principal_id_to_canister_principal_id_map,
            user_principal_id,
            canister_principal_id,
        );
    });
}

fn receive_principal_id_to_canister_id_mapping_from_user_index_canister_impl(
    user_principal_id_to_canister_principal_id_map: &mut StableBTreeMap<
        Memory,
        StorablePrincipal,
        StorablePrincipal,
    >,
    user_principal_id: Principal,
    canister_principal_id: Principal,
) {
    user_principal_id_to_canister_principal_id_map
        .insert(
            StorablePrincipal(user_principal_id),
            StorablePrincipal(canister_principal_id),
        )
        .ok();
}
