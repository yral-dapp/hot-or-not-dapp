use ic_stable_memory::utils::ic_types::SPrincipal;
use ic_state_machine_tests::{CanisterId, CanisterInstallMode, CanisterSettingsArgs, StateMachine};
use shared_utils::types::{
    init_args::{PostCacheInitArgs, ProjectMemberIndexInitArgs, UserIndexInitArgs},
    known_principal::{KnownPrincipalMap, KnownPrincipalType},
};

use super::test_constants::{
    get_configuration_canister_wasm, get_global_super_admin_principal_id,
    get_post_cache_canister_wasm, get_user_index_canister_wasm,
    CANISTER_INITIAL_CYCLES_FOR_INDEX_CANISTERS, CANISTER_INITIAL_CYCLES_FOR_REGULAR_CANISTERS,
};

pub struct KnownCanisters {
    pub user_index_canister_id: CanisterId,
    pub project_member_index_canister_id: CanisterId,
    pub post_cache_canister_id: CanisterId,
}

fn get_known_principal_ids(
    user_index_canister_id: CanisterId,
    project_member_index_canister_id: CanisterId,
    post_cache_canister_id: CanisterId,
) -> KnownPrincipalMap {
    let mut known_principal_map = KnownPrincipalMap::default();
    known_principal_map.insert(
        KnownPrincipalType::UserIdGlobalSuperAdmin,
        SPrincipal(get_global_super_admin_principal_id().into()),
    );
    known_principal_map.insert(
        KnownPrincipalType::CanisterIdUserIndex,
        SPrincipal(user_index_canister_id.get().into()),
    );
    known_principal_map.insert(
        KnownPrincipalType::CanisterIdProjectMemberIndex,
        SPrincipal(project_member_index_canister_id.get().into()),
    );
    known_principal_map.insert(
        KnownPrincipalType::CanisterIdPostCache,
        SPrincipal(post_cache_canister_id.get().into()),
    );

    known_principal_map
}

pub fn get_initialized_env_with_provisioned_known_canisters(
    state_machine: &StateMachine,
) -> KnownCanisters {
    let user_index_canister_id = state_machine.create_canister_with_cycles(
        CANISTER_INITIAL_CYCLES_FOR_INDEX_CANISTERS,
        Some(CanisterSettingsArgs {
            controllers: Some(vec![get_global_super_admin_principal_id()]),
            ..Default::default()
        }),
    );
    let project_member_index_canister_id = state_machine.create_canister_with_cycles(
        CANISTER_INITIAL_CYCLES_FOR_REGULAR_CANISTERS,
        Some(CanisterSettingsArgs {
            controllers: Some(vec![get_global_super_admin_principal_id()]),
            ..Default::default()
        }),
    );
    let post_cache_canister_id = state_machine.create_canister_with_cycles(
        CANISTER_INITIAL_CYCLES_FOR_REGULAR_CANISTERS,
        Some(CanisterSettingsArgs {
            controllers: Some(vec![get_global_super_admin_principal_id()]),
            ..Default::default()
        }),
    );

    let known_principal_ids = get_known_principal_ids(
        user_index_canister_id,
        project_member_index_canister_id,
        post_cache_canister_id,
    );

    state_machine
        .install_wasm_in_mode(
            user_index_canister_id,
            CanisterInstallMode::Install,
            get_user_index_canister_wasm(),
            candid::encode_one(UserIndexInitArgs {
                known_principal_ids: known_principal_ids.clone(),
            })
            .unwrap(),
        )
        .ok();
    state_machine
        .install_wasm_in_mode(
            project_member_index_canister_id,
            CanisterInstallMode::Install,
            get_configuration_canister_wasm(),
            candid::encode_one(ProjectMemberIndexInitArgs {
                known_principal_ids: known_principal_ids.clone(),
            })
            .unwrap(),
        )
        .ok();
    state_machine
        .install_wasm_in_mode(
            post_cache_canister_id,
            CanisterInstallMode::Install,
            get_post_cache_canister_wasm(),
            candid::encode_one(PostCacheInitArgs {
                known_principal_ids,
            })
            .unwrap(),
        )
        .ok();

    KnownCanisters {
        user_index_canister_id,
        project_member_index_canister_id,
        post_cache_canister_id,
    }
}
