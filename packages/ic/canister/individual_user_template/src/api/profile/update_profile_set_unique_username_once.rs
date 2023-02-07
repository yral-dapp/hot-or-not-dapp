use crate::data_model::{AccessControlMap, MyKnownPrincipalIdsMap, Profile};
use ic_cdk::api::call;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::{
    access_control::{self, UserAccessRole},
    constant,
    types::canister_specific::{
        individual_user_template::error_types::UpdateProfileSetUniqueUsernameError,
        user_index::error_types::SetUniqueUsernameError,
    },
};

/// # Access Control
/// Only the user whose profile details are stored in this canister can update their details.
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn update_profile_set_unique_username_once(
    new_unique_username: String,
) -> Result<(), UpdateProfileSetUniqueUsernameError> {
    let request_maker = ic_cdk::caller();
    let known_principal_ids = s!(MyKnownPrincipalIdsMap);

    // * access control
    let user_id_access_control_map = s!(AccessControlMap);

    if !(access_control::does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::ProfileOwner,
        SPrincipal(request_maker),
    )) {
        return Err(UpdateProfileSetUniqueUsernameError::NotAuthorized);
    }

    // * cross canister call
    let (response,): (Result<(), SetUniqueUsernameError>,) = call::call(
        constant::get_user_index_canister_principal_id(known_principal_ids),
        "update_index_with_unique_user_name_corresponding_to_user_principal_id",
        (new_unique_username.clone(), request_maker),
    )
    .await
    .map_err(|_| UpdateProfileSetUniqueUsernameError::UserIndexCrossCanisterCallFailed)?;

    match response {
        Ok(()) => {
            let mut profile: Profile = s!(Profile);
            profile.set_unique_user_name(new_unique_username);
            s! {Profile = profile};
            Ok(())
        }
        Err(SetUniqueUsernameError::UsernameAlreadyTaken) => {
            Err(UpdateProfileSetUniqueUsernameError::UsernameAlreadyTaken)
        }
        Err(SetUniqueUsernameError::SendingCanisterDoesNotMatchUserCanisterId) => {
            Err(UpdateProfileSetUniqueUsernameError::SendingCanisterDoesNotMatchUserCanisterId)
        }
        Err(SetUniqueUsernameError::UserCanisterEntryDoesNotExist) => {
            Err(UpdateProfileSetUniqueUsernameError::UserCanisterEntryDoesNotExist)
        }
    }
}
