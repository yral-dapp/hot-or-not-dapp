use crate::UniqueUserNameToUserPrincipalIdMap;
use ic_stable_memory::s;

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_index_details_is_user_name_taken(user_name: String) -> bool {
    let unique_user_name_to_user_principal_id_map = s!(UniqueUserNameToUserPrincipalIdMap);

    unique_user_name_to_user_principal_id_map.contains_key(&user_name)
}
