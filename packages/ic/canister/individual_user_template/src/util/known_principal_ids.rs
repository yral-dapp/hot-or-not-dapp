use ic_stable_memory::s;
use shared_utils::canister_specific::individual_user_template::types::args::IndividualUserTemplateInitArgs;

use crate::data_model::MyKnownPrincipalIdsMap;

pub fn save_known_principal_ids_from_user_index_init_args_to_my_known_principal_ids_map(
    init_args: &IndividualUserTemplateInitArgs,
) {
    let mut my_known_principal_ids_map = s!(MyKnownPrincipalIdsMap);

    for (known_principal_type, principal) in init_args.known_principal_ids.iter() {
        my_known_principal_ids_map.insert(known_principal_type.clone(), principal.clone());
    }

    s! { MyKnownPrincipalIdsMap = my_known_principal_ids_map };
}
