use std::collections::HashMap;

use candid::Principal;
use ic_stable_memory::utils::ic_types::SPrincipal;
use shared_utils::{
    canister_specific::individual_user_template::types::args::IndividualUserTemplateInitArgs,
    common::types::known_principal::KnownPrincipalType,
};

pub fn get_known_principal_ids_for_individual_user_template(
    known_principal_ids: &HashMap<KnownPrincipalType, Principal>,
    profile_owner: Principal,
) -> IndividualUserTemplateInitArgs {
    let mut individual_user_tempalate_init_args: IndividualUserTemplateInitArgs =
        IndividualUserTemplateInitArgs::new(profile_owner);

    for (known_principal_type, principal) in known_principal_ids.iter() {
        individual_user_tempalate_init_args
            .known_principal_ids
            .insert(known_principal_type.clone(), SPrincipal(principal.clone()));
    }

    individual_user_tempalate_init_args
}

#[cfg(test)]
mod test {
    use test_utils::setup::test_constants::{
        get_mock_canister_id_configuration, get_mock_canister_id_post_cache,
        get_mock_canister_id_user_index, get_mock_user_alice_principal_id,
    };

    use super::*;

    #[test]
    fn test_get_known_principal_ids_for_individual_user_template() {
        let mut known_principal_ids = HashMap::new();
        let profile_owner = get_mock_user_alice_principal_id();
        known_principal_ids.insert(
            KnownPrincipalType::CanisterIdConfiguration,
            get_mock_canister_id_configuration(),
        );
        known_principal_ids.insert(
            KnownPrincipalType::CanisterIdUserIndex,
            get_mock_canister_id_user_index(),
        );
        known_principal_ids.insert(
            KnownPrincipalType::CanisterIdPostCache,
            get_mock_canister_id_post_cache(),
        );

        let individual_user_tempalate_init_args =
            get_known_principal_ids_for_individual_user_template(
                &known_principal_ids,
                profile_owner,
            );

        assert_eq!(
            individual_user_tempalate_init_args.profile_owner,
            profile_owner
        );
        assert_eq!(
            individual_user_tempalate_init_args
                .known_principal_ids
                .get(&KnownPrincipalType::CanisterIdConfiguration)
                .unwrap()
                .0,
            get_mock_canister_id_configuration()
        );
        assert_eq!(
            individual_user_tempalate_init_args
                .known_principal_ids
                .get(&KnownPrincipalType::CanisterIdUserIndex)
                .unwrap()
                .0,
            get_mock_canister_id_user_index()
        );
        assert_eq!(
            individual_user_tempalate_init_args
                .known_principal_ids
                .get(&KnownPrincipalType::CanisterIdPostCache)
                .unwrap()
                .0,
            get_mock_canister_id_post_cache()
        );
    }
}
