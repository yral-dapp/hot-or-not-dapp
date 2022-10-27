use candid::CandidType;
use ic_cdk::api::call;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use individual_user_template_lib::{AccessControlMap, Profile};
use shared_utils::{
    access_control::{self, UserAccessRole},
    constant,
    shared_types::user_index::error_types::SetUniqueUsernameError,
};

#[derive(CandidType)]
pub enum UpdateProfileSetUniqueUsernameError {
    NotAuthorized,
    UsernameAlreadyTaken,
    SendingCanisterDoesNotMatchUserCanisterId,
    UserCanisterEntryDoesNotExist,
    UserIndexCrossCanisterCallFailed,
}

/// # Access Control
/// Only the user whose profile details are stored in this canister can update their details.
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn update_profile_set_unique_username_once(
    new_unique_username: String,
) -> Result<(), UpdateProfileSetUniqueUsernameError> {
    // * access control
    let user_id_access_control_map: AccessControlMap = s!(AccessControlMap);

    if !(access_control::does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::ProfileOwner,
        SPrincipal(ic_cdk::caller()),
    )) {
        return Err(UpdateProfileSetUniqueUsernameError::NotAuthorized);
    }

    // * cross canister call
    let (response,): (Result<(), SetUniqueUsernameError>,) = call::call(
        constant::get_user_index_canister_principal_id(),
        "update_index_with_unique_user_name_corresponding_to_user_principal_id",
        (new_unique_username.clone(), ic_cdk::caller()),
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
