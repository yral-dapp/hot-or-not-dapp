use ic_cdk::api::call;
use ic_stable_memory::s;
use individual_user_template_lib::{model::profile::UserProfile, MyKnownPrincipalIdsMap, Profile};
use shared_utils::{
    canister_specific::individual_user_template::types::profile::UserProfileDetailsForFrontend,
    constant,
    types::canister_specific::{
        individual_user_template::error_types::UpdateProfileSetUniqueUsernameError,
        user_index::error_types::SetUniqueUsernameError,
    },
};

// TODO: remove after done using
/// # Access Control
/// Only the user whose profile details are stored in this canister can update their details.
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn update_profile_resend_username_to_user_index_canister(
) -> Result<(), UpdateProfileSetUniqueUsernameError> {
    let request_maker_user_index = ic_cdk::caller();
    let known_principal_ids: MyKnownPrincipalIdsMap = s!(MyKnownPrincipalIdsMap);

    // * access control
    if !(request_maker_user_index
        == constant::get_user_index_canister_principal_id(known_principal_ids.clone()))
    {
        return Err(UpdateProfileSetUniqueUsernameError::NotAuthorized);
    }

    let profile: UserProfile = s!(Profile);
    let UserProfileDetailsForFrontend {
        unique_user_name,
        principal_id,
        ..
    } = profile.get_user_profile_details_for_frontend();

    match unique_user_name {
        Some(unique_user_name) => {
            let (_response,): (Result<(), SetUniqueUsernameError>,) = call::call(
                constant::get_user_index_canister_principal_id(known_principal_ids),
                "update_index_with_unique_user_name_corresponding_to_user_principal_id_allow_same_username_from_existing_principal",
                (unique_user_name, principal_id),
            )
            .await
            .map_err(|_| UpdateProfileSetUniqueUsernameError::UserIndexCrossCanisterCallFailed)?;
        }
        None => {}
    }

    Ok(())
}
