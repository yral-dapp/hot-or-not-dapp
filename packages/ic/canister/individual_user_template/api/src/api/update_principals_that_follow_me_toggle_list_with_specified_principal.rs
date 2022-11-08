use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::call;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use individual_user_template_lib::{MyKnownPrincipalIdsMap, PrincipalsThatFollowMe};
use shared_utils::constant;

#[derive(CandidType, Deserialize)]
pub enum AnotherUserFollowedMeError {
    UserIndexCrossCanisterCallFailed,
    UserTryingToFollowMeDoesNotExist,
    NotAuthorized,
    FollowersListFull,
}

// TODO: implement a separate membership canister that holds entries for all canisters of this project and perform access control
/// # Access Control
/// Only allow calls from canisters of this project
#[ic_cdk_macros::update]
#[candid::candid_method(update)]
async fn update_principals_that_follow_me_toggle_list_with_specified_principal(
    user_principal_id_whos_trying_to_follow_me: Principal,
) -> Result<bool, AnotherUserFollowedMeError> {
    let calling_canister_principal = ic_cdk::caller();
    let known_principal_ids: MyKnownPrincipalIdsMap = s!(MyKnownPrincipalIdsMap);

    let (user_trying_to_follow_me_canister_id,): (Option<Principal>,) = call::call(
        constant::get_user_index_canister_principal_id(known_principal_ids),
        "get_user_canister_id_from_user_principal_id",
        (user_principal_id_whos_trying_to_follow_me,),
    )
    .await
    .map_err(|_| AnotherUserFollowedMeError::UserIndexCrossCanisterCallFailed)?;
    let user_trying_to_follow_me_canister_id = user_trying_to_follow_me_canister_id
        .ok_or(AnotherUserFollowedMeError::UserTryingToFollowMeDoesNotExist)?;

    if user_trying_to_follow_me_canister_id != calling_canister_principal {
        return Err(AnotherUserFollowedMeError::NotAuthorized);
    }

    let mut my_followers_list: PrincipalsThatFollowMe = s!(PrincipalsThatFollowMe);

    if my_followers_list.len() as u64 > constant::MAX_USERS_IN_FOLLOWER_FOLLOWING_LIST {
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
