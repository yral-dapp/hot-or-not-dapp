use self::internal::UserProfileDetailsFromFrontend;
use crate::{AccessControlMap, Profile};
use candid::Principal;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use internal::UserProfile;
use shared_utils::access_control::{does_principal_have_role, UserAccessRole};

pub mod internal;

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_profile_details() -> UserProfile {
    s!(Profile)
}

/// # Access Control
/// Only the user whose profile details are stored in this canister can update their details.
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_profile_details(user_profile_details: UserProfileDetailsFromFrontend) -> UserProfile {
    // * access control
    let user_id_access_control_map = s!(AccessControlMap);
    assert!(
        does_principal_have_role(
            &user_id_access_control_map,
            UserAccessRole::ProfileOwner,
            SPrincipal(ic_cdk::caller())
        ),
        "Only the user whose profile details are stored in this canister can follow another user."
    );

    let mut profile = s!(Profile);
    profile.update_profile_details(user_profile_details);
    s! {Profile = profile};

    s!(Profile)
}

/// # Access Control
/// Only the user whose profile details are stored in this canister can create a post.
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_profile_toggle_following_list_by_user_to_follow(user_to_follow: Principal) -> bool {
    // * access control
    let user_id_access_control_map = s!(AccessControlMap);
    assert!(
        does_principal_have_role(
            &user_id_access_control_map,
            UserAccessRole::ProfileOwner,
            SPrincipal(ic_cdk::caller())
        ),
        "Only the user whose profile details are stored in this canister can follow another user."
    );

    let mut profile = s!(Profile);
    let toggle_status =
        profile.update_profile_toggle_following_list_by_user_to_follow(SPrincipal(user_to_follow));
    s! {Profile = profile};

    toggle_status
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn update_profile_toggle_follower_list_by_calling_principal() -> bool {
    let mut profile = s!(Profile);
    let toggle_status = profile
        .update_profile_toggle_follower_list_by_calling_principal(SPrincipal(ic_cdk::caller()));
    s! {Profile = profile};

    toggle_status
}
