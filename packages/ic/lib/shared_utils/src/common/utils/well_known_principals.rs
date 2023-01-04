use std::future::Future;

use candid::Principal;
use ic_cdk::api::call;

use crate::common::types::known_principal::{KnownPrincipalMapV1, KnownPrincipalType};

/// Gets canister principal ID from the local cache and if not present,
/// fetches it from the configuration canister and adds it to the local cache
pub async fn get_canister_principal_id<Func, Fut>(
    known_principal_ids: &mut KnownPrincipalMapV1,
    canister_type: KnownPrincipalType,
    configuration_canister_response_provider: &Func,
) -> Principal
where
    Func: Fn(Principal, KnownPrincipalType) -> Fut,
    Fut: Future<Output = Principal>,
{
    match known_principal_ids.get(&canister_type) {
        Some(principal) => principal.clone(),
        None => {
            let configuration_canister_principal_id = known_principal_ids
                .get(&KnownPrincipalType::CanisterIdConfiguration)
                .expect(
                    "Configuration canister principal ID not found in the local cache. Please add",
                )
                .clone();
            let requested_canister_principal_id = configuration_canister_response_provider(
                configuration_canister_principal_id,
                canister_type.clone(),
            )
            .await;
            known_principal_ids.insert(canister_type, requested_canister_principal_id.clone());
            requested_canister_principal_id
        }
    }
}

/// Gets canister principal ID from the configuration canister
pub async fn get_canister_principal_id_from_configuration_canister(
    configuration_canister_principal_id: Principal,
    canister_type: KnownPrincipalType,
) -> Principal {
    let (response_from_config_canister,): (Option<Principal>,) = call::call(
        configuration_canister_principal_id,
        "get_well_known_principal_value",
        (canister_type,),
    )
    .await
    .expect("Failed to get canister principal ID from the configuration canister");

    response_from_config_canister
        .expect("Canister principal ID not found in the configuration canister")
}
