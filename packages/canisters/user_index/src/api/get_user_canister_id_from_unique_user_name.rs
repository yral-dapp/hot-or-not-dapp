use crate::{UniqueUserNameToUserPrincipalIdMap, UserPrincipalIdToCanisterIdMap};
use candid::Principal;
use ic_stable_memory::s;

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_user_canister_id_from_unique_user_name(user_name: String) -> Option<Principal> {
    let unique_user_name_to_user_principal_id_map = s!(UniqueUserNameToUserPrincipalIdMap);
    let user_id_to_canister_id_map = s!(UserPrincipalIdToCanisterIdMap);

    let profile_principal_id = unique_user_name_to_user_principal_id_map.get_cloned(&user_name)?;

    user_id_to_canister_id_map
        .get_cloned(&profile_principal_id)
        .map(|canister_id| canister_id.0)
}
