use candid::Principal;
use ic_stable_memory::s;
use shared_utils::common::types::init_args::{IndividualUserTemplateInitArgs, UserIndexInitArgs};

use crate::MyKnownPrincipalIdsMap;

pub fn get_known_principal_ids_for_individual_user_template(
    profile_owner: Principal,
) -> IndividualUserTemplateInitArgs {
    let mut individual_user_tempalate_init_args: IndividualUserTemplateInitArgs =
        IndividualUserTemplateInitArgs::new(profile_owner);
    let my_known_principal_ids_map: MyKnownPrincipalIdsMap = s!(MyKnownPrincipalIdsMap);

    for (known_principal_type, principal) in my_known_principal_ids_map {
        individual_user_tempalate_init_args
            .known_principal_ids
            .insert(known_principal_type, principal);
    }

    individual_user_tempalate_init_args
}

pub fn save_known_principal_ids_from_user_index_init_args_to_my_known_principal_ids_map(
    init_args: UserIndexInitArgs,
) {
    let mut my_known_principal_ids_map: MyKnownPrincipalIdsMap = s!(MyKnownPrincipalIdsMap);

    for (known_principal_type, principal) in init_args.known_principal_ids {
        my_known_principal_ids_map.insert(known_principal_type, principal);
    }

    s! { MyKnownPrincipalIdsMap = my_known_principal_ids_map };
}
