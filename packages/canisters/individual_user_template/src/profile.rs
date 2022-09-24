use self::internal::{UserProfileDetailsForFrontend, UserProfileUpdateDetailsFromFrontend};
use crate::{AccessControlMap, PrincipalsIFollow, PrincipalsThatFollowMe, Profile};
use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::call;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use internal::UserProfile;
use shared_utils::{
    access_control::{does_principal_have_role, UserAccessRole},
    constant::MAX_USERS_IN_FOLLOWER_FOLLOWING_LIST,
    shared_types::user_index::error_types::SetUniqueUsernameError,
};

pub mod internal;

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_profile_details() -> UserProfile {
    s!(Profile)
}

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
    let user_id_access_control_map = s!(AccessControlMap);

    if !(does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::ProfileOwner,
        SPrincipal(ic_cdk::caller()),
    )) {
        return Err(UpdateProfileDetailsError::NotAuthorized);
    }

    let mut profile = s!(Profile);
    profile.update_profile_details(user_profile_details);
    s! {Profile = profile};

    Ok(s!(Profile).get_user_profile_details_for_frontend())
}

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
    let user_id_access_control_map = s!(AccessControlMap);

    if !(does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::ProfileOwner,
        SPrincipal(ic_cdk::caller()),
    )) {
        return Err(UpdateProfileSetUniqueUsernameError::NotAuthorized);
    }

    // * cross canister call

    let (response,): (Result<(), SetUniqueUsernameError>,) = call::call(
        Principal::from_text(option_env!("CANISTER_ID_user_index").unwrap()).unwrap(),
        "update_index_with_unique_user_name_corresponding_to_user_principal_id",
        (new_unique_username.clone(), ic_cdk::caller()),
    )
    .await
    .map_err(|_| UpdateProfileSetUniqueUsernameError::UserIndexCrossCanisterCallFailed)?;

    match response {
        Ok(()) => {
            let mut profile = s!(Profile);
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

#[derive(CandidType)]
pub enum FollowAnotherUserProfileError {
    NotAuthorized,
    UsersICanFollowListIsFull,
    UserIndexCrossCanisterCallFailed,
    UserToFollowDoesNotExist,
    UserITriedToFollowCrossCanisterCallFailed,
    UserITriedToFollowDidNotFindMe,
    MyCanisterIDDoesNotMatchMyPrincipalCanisterIDMappingSeenByUserITriedToFollow,
    UserITriedToFollowHasTheirFollowersListFull,
}

/// # Access Control
/// Only the user whose profile details are stored in this canister follow another user's profile.
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn update_principals_i_follow_toggle_list_with_principal_specified(
    user_to_follow: Principal,
) -> Result<bool, FollowAnotherUserProfileError> {
    // * access control
    let user_id_access_control_map = s!(AccessControlMap);
    if !does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::ProfileOwner,
        SPrincipal(ic_cdk::caller()),
    ) {
        return Err(FollowAnotherUserProfileError::NotAuthorized);
    }

    let principals_i_follow = s!(PrincipalsIFollow);

    if principals_i_follow.len() as u64 > MAX_USERS_IN_FOLLOWER_FOLLOWING_LIST {
        return Err(FollowAnotherUserProfileError::UsersICanFollowListIsFull);
    }

    // inter canister call to user index to get the user canister id of the user to follow
    let (followee_canister_id,): (Option<Principal>,) = call::call(
        Principal::from_text(option_env!("CANISTER_ID_user_index").unwrap()).unwrap(),
        "get_user_canister_id_from_user_principal_id",
        (user_to_follow,),
    )
    .await
    .map_err(|_| FollowAnotherUserProfileError::UserIndexCrossCanisterCallFailed)?;
    let followee_canister_id =
        followee_canister_id.ok_or(FollowAnotherUserProfileError::UserToFollowDoesNotExist)?;

    // inter canister call to update the followee's list of followers
    let (response,): (Result<bool, AnotherUserFollowedMeError>,) = call::call(
        followee_canister_id,
        "update_principals_that_follow_me_toggle_list_with_specified_principal",
        (ic_cdk::caller(),),
    )
    .await
    .map_err(|_| FollowAnotherUserProfileError::UserITriedToFollowCrossCanisterCallFailed)?;

    let following_call_status_inner_bool = response.map_err(|e| match e {
        AnotherUserFollowedMeError::UserIndexCrossCanisterCallFailed => {
            FollowAnotherUserProfileError::UserITriedToFollowCrossCanisterCallFailed
        }
        AnotherUserFollowedMeError::UserTryingToFollowMeDoesNotExist => {
            FollowAnotherUserProfileError::UserITriedToFollowDidNotFindMe
        }
        AnotherUserFollowedMeError::NotAuthorized => {
            FollowAnotherUserProfileError::MyCanisterIDDoesNotMatchMyPrincipalCanisterIDMappingSeenByUserITriedToFollow
        }
        AnotherUserFollowedMeError::FollowersListFull => {
            FollowAnotherUserProfileError::UserITriedToFollowHasTheirFollowersListFull
        }
    })?;

    // * update principals i follow
    if following_call_status_inner_bool {
        let mut principals_i_follow = s!(PrincipalsIFollow);
        principals_i_follow.insert(SPrincipal(user_to_follow));
        s! {PrincipalsIFollow = principals_i_follow};
        Ok(true)
    } else {
        let mut principals_i_follow = s!(PrincipalsIFollow);
        principals_i_follow.remove(&SPrincipal(user_to_follow));
        s! {PrincipalsIFollow = principals_i_follow};
        Ok(false)
    }
}

#[derive(CandidType, Deserialize)]
pub enum AnotherUserFollowedMeError {
    UserIndexCrossCanisterCallFailed,
    UserTryingToFollowMeDoesNotExist,
    NotAuthorized,
    FollowersListFull,
}

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn update_principals_that_follow_me_toggle_list_with_specified_principal(
    user_principal_id_whos_trying_to_follow_me: Principal,
) -> Result<bool, AnotherUserFollowedMeError> {
    let (user_trying_to_follow_me_canister_id,): (Option<Principal>,) = call::call(
        Principal::from_text(option_env!("CANISTER_ID_user_index").unwrap()).unwrap(),
        "get_user_canister_id_from_user_principal_id",
        (user_principal_id_whos_trying_to_follow_me,),
    )
    .await
    .map_err(|_| AnotherUserFollowedMeError::UserIndexCrossCanisterCallFailed)?;
    let user_trying_to_follow_me_canister_id = user_trying_to_follow_me_canister_id
        .ok_or(AnotherUserFollowedMeError::UserTryingToFollowMeDoesNotExist)?;

    if !(user_trying_to_follow_me_canister_id != ic_cdk::caller()) {
        return Err(AnotherUserFollowedMeError::NotAuthorized);
    }

    let mut my_followers_list = s!(PrincipalsThatFollowMe);

    if my_followers_list.len() as u64 > MAX_USERS_IN_FOLLOWER_FOLLOWING_LIST {
        return Err(AnotherUserFollowedMeError::FollowersListFull);
    }

    // * update principals that follow me list
    if my_followers_list.contains(&SPrincipal(user_principal_id_whos_trying_to_follow_me)) {
        my_followers_list.remove(&SPrincipal(user_principal_id_whos_trying_to_follow_me));
        s! {PrincipalsThatFollowMe = my_followers_list};
        Ok(false)
    } else {
        my_followers_list.insert(SPrincipal(user_principal_id_whos_trying_to_follow_me));
        s! {PrincipalsThatFollowMe = my_followers_list};
        Ok(true)
    }
}

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_following_status_do_i_follow_this_user(user_principal_to_check: Principal) -> bool {
    let principals_i_follow = s!(PrincipalsIFollow);
    principals_i_follow.contains(&SPrincipal(user_principal_to_check))
}
