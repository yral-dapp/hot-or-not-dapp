use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::canister_specific::individual_user_template::types::args::IndividualUserTemplateInitArgs;

use crate::data_model::MyKnownPrincipalIdsMap;

pub fn save_known_principal_ids_from_user_index_init_args_to_my_known_principal_ids_map(
    init_args: &IndividualUserTemplateInitArgs,
) {
    let mut my_known_principal_ids_map = s!(MyKnownPrincipalIdsMap);

    if let Some(known_principal_ids) = init_args.known_principal_ids.clone() {
        for (known_principal_type, principal) in known_principal_ids.iter() {
            my_known_principal_ids_map
                .insert(known_principal_type.clone(), SPrincipal(principal.clone()));
        }
    }

    s! { MyKnownPrincipalIdsMap = my_known_principal_ids_map };
}
