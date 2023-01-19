use candid::Principal;
use ic_cdk::api::{
    self,
    management_canister::{
        main::{self, CanisterInstallMode, CreateCanisterArgument, InstallCodeArgument},
        provisional::{CanisterIdRecord, CanisterSettings},
    },
};
use shared_utils::common::types::known_principal::KnownPrincipalType;

use crate::CANISTER_DATA;

use super::known_principal_ids;

const INDIVIDUAL_USER_TEMPLATE_CANISTER_WASM: &[u8] = include_bytes!(
    "../../../../../../target/wasm32-unknown-unknown/release/individual_user_template.wasm.gz"
);

pub async fn create_users_canister(profile_owner: Principal) -> Principal {
    // * config for provisioning canister
    let arg = CreateCanisterArgument {
        settings: Some(CanisterSettings {
            controllers: Some(vec![
                // this canister
                api::id(),
                // hot or not global owner principal
                CANISTER_DATA.with(|canister_data_ref_cell| {
                    canister_data_ref_cell
                        .borrow()
                        .known_principal_ids
                        .get(&KnownPrincipalType::UserIdGlobalSuperAdmin)
                        .unwrap()
                        .clone()
                }),
            ]),
            compute_allocation: None,
            memory_allocation: None,
            freezing_threshold: None,
        }),
    };

    // * provisioned canister
    let canister_id: Principal = main::create_canister(arg).await.unwrap().0.canister_id;

    // * deposit an additional 1T cycles
    main::deposit_cycles(CanisterIdRecord { canister_id }, 1_000_000_000_000)
        .await
        .unwrap();

    let individual_user_tempalate_init_args = CANISTER_DATA.with(|canister_data_ref_cell| {
        known_principal_ids::get_known_principal_ids_for_individual_user_template(
            &canister_data_ref_cell.borrow().known_principal_ids,
            profile_owner,
        )
    });

    // * encode argument for user canister init lifecycle method
    let arg = candid::encode_one(individual_user_tempalate_init_args)
        .expect("Failed to serialize the install argument.");

    ic_cdk::print(format!(
        "🥫 Provisioned canister ID: {:?}",
        canister_id.to_text()
    ));
    // * install wasm to provisioned canister
    main::install_code(InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id,
        wasm_module: INDIVIDUAL_USER_TEMPLATE_CANISTER_WASM.into(),
        arg,
    })
    .await
    .unwrap();

    canister_id
}

pub async fn upgrade_individual_user_canister(
    canister_id: Principal,
    install_mode: CanisterInstallMode,
    version_number: u64,
) -> Result<(), ()> {
    let arg =
        candid::encode_args((version_number,)).expect("Failed to serialize the install argument.");

    main::install_code(InstallCodeArgument {
        mode: install_mode,
        canister_id,
        wasm_module: INDIVIDUAL_USER_TEMPLATE_CANISTER_WASM.into(),
        arg,
    })
    .await
    .map_err(|_| ())
}
