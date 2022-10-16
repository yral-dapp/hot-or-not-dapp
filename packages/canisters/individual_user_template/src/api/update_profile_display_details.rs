use candid::CandidType;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::access_control::{self, UserAccessRole};

use crate::{
    internal::model::profile::{
        UserProfileDetailsForFrontend, UserProfileUpdateDetailsFromFrontend,
    },
    AccessControlMap, Profile,
};

#[derive(CandidType)]
pub enum UpdateProfileDetailsError {
    NotAuthorized,
}

/// # Access Control
/// Only the user whose profile details are stored in this canister can update their details.
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_profile_display_details(
    user_profile_details: UserProfileUpdateDetailsFromFrontend,
) -> Result<UserProfileDetailsForFrontend, UpdateProfileDetailsError> {
    // * access control
    let user_id_access_control_map: AccessControlMap = s!(AccessControlMap);

    if !(access_control::does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::ProfileOwner,
        SPrincipal(ic_cdk::caller()),
    )) {
        return Err(UpdateProfileDetailsError::NotAuthorized);
    }

    let mut profile: Profile = s!(Profile);
    profile.update_profile_details(user_profile_details);
    s! {Profile = profile};

    Ok(s!(Profile).get_user_profile_details_for_frontend())
}
