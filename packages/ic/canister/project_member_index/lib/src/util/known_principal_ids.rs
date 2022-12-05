use ic_stable_memory::s;
use shared_utils::types::init_args::ProjectMemberIndexInitArgs;

use crate::MyKnownPrincipalIdsMap;

pub fn save_known_principal_ids_from_project_member_index_init_args_to_my_known_principal_ids_map(
    init_args: ProjectMemberIndexInitArgs,
) {
    let mut my_known_principal_ids_map: MyKnownPrincipalIdsMap = s!(MyKnownPrincipalIdsMap);

    for (known_principal_type, principal) in init_args.known_principal_ids {
        my_known_principal_ids_map.insert(known_principal_type, principal);
    }

    s! { MyKnownPrincipalIdsMap = my_known_principal_ids_map };
}
