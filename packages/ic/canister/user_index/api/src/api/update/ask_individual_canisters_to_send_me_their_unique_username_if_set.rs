use ic_cdk::api::call;
use ic_stable_memory::s;
use shared_utils::shared_types::individual_user_template::error_types::UpdateProfileSetUniqueUsernameError;
use user_index_lib::UserPrincipalIdToCanisterIdMap;

// TODO: remove after done using
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn ask_individual_canisters_to_send_me_their_unique_username_if_set(
) -> Result<(), UpdateProfileSetUniqueUsernameError> {
    let user_principal_id_to_canister_id_map: UserPrincipalIdToCanisterIdMap =
        s!(UserPrincipalIdToCanisterIdMap);

    let mut iterator_over_map = user_principal_id_to_canister_id_map.iter();

    while iterator_over_map.has_next() {
        let (_user_principal_id, user_canister_id) = iterator_over_map.next().unwrap();

        let (_response,): (Result<(), UpdateProfileSetUniqueUsernameError>,) = call::call(
            user_canister_id.0,
            "update_profile_resend_username_to_user_index_canister",
            (),
        )
        .await
        .map_err(|_| UpdateProfileSetUniqueUsernameError::UserIndexCrossCanisterCallFailed)?;
    }

    Ok(())
}
