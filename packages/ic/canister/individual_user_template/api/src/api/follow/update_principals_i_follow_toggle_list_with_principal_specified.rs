use super::update_principals_that_follow_me_toggle_list_with_specified_principal::AnotherUserFollowedMeError;
use candid::{CandidType, Principal};
use ic_cdk::api::call;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use individual_user_template_lib::{AccessControlMap, MyKnownPrincipalIdsMap, PrincipalsIFollow};
use shared_utils::{
    access_control::{self, UserAccessRole},
    constant,
};

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
/// Only the user whose profile details are stored in this canister can follow another user's profile.
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn update_principals_i_follow_toggle_list_with_principal_specified(
    user_to_follow: Principal,
) -> Result<bool, FollowAnotherUserProfileError> {
    let current_caller = ic_cdk::caller();

    // * access control
    let user_id_access_control_map: AccessControlMap = s!(AccessControlMap);
    if !access_control::does_principal_have_role(
        &user_id_access_control_map,
        UserAccessRole::ProfileOwner,
        SPrincipal(current_caller),
    ) {
        return Err(FollowAnotherUserProfileError::NotAuthorized);
    }

    let principals_i_follow: PrincipalsIFollow = s!(PrincipalsIFollow);

    if principals_i_follow.len() as u64 > constant::MAX_USERS_IN_FOLLOWER_FOLLOWING_LIST {
        return Err(FollowAnotherUserProfileError::UsersICanFollowListIsFull);
    }

    let known_principal_ids: MyKnownPrincipalIdsMap = s!(MyKnownPrincipalIdsMap);
    // * inter canister call to user index to get the user canister id of the user to follow
    let (followee_canister_id,): (Option<Principal>,) = call::call(
        constant::get_user_index_canister_principal_id(known_principal_ids),
        "get_user_canister_id_from_user_principal_id",
        (user_to_follow,),
    )
    .await
    .map_err(|_| FollowAnotherUserProfileError::UserIndexCrossCanisterCallFailed)?;
    let followee_canister_id =
        followee_canister_id.ok_or(FollowAnotherUserProfileError::UserToFollowDoesNotExist)?;

    // * inter canister call to update the followee's list of followers
    let (response,): (Result<bool, AnotherUserFollowedMeError>,) = call::call(
        followee_canister_id,
        "update_principals_that_follow_me_toggle_list_with_specified_principal",
        (current_caller,),
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
