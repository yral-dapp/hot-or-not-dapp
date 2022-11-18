use candid::Principal;
use ic_cdk::api::management_canister::main::CanisterStatusResponse;
use ic_state_machine_tests::{CanisterId, PrincipalId, StateMachine, WasmResult};
use test_utils::setup::{
    initialize_test_env_with_known_canisters::{
        get_initialized_env_with_provisioned_known_canisters, KnownCanisters,
    },
    test_constants::{get_alice_principal_id, get_global_super_admin_principal_id},
};

#[test]
fn every_day_check_individual_canister_cycle_balances_and_topup_as_necessary() {
    // * Arrange
    let state_machine = StateMachine::new();
    let KnownCanisters {
        user_index_canister_id,
        ..
    } = get_initialized_env_with_provisioned_known_canisters(&state_machine);
    let alice_principal_id = get_alice_principal_id();

    // * Act
    let alice_canister_id = state_machine.execute_ingress_as(
        alice_principal_id,
        user_index_canister_id,
        "get_user_index_create_if_not_exists_else_return_canister_id_for_embedded_user_principal_id",
        candid::encode_one(()).unwrap(),
    ).map(|reply_payload| {
        let (alice_canister_id,): (Principal,) = match reply_payload {
            WasmResult::Reply(payload) => candid::decode_args(&payload).unwrap(),
            _ => panic!("\n🛑 get_user_index_create_if_not_exists_else_return_canister_id_for_embedded_user_principal_id failed\n"),
        };
        alice_canister_id
    }).unwrap();

    let alice_starting_cycle_balance = state_machine.execute_ingress_as(
        get_global_super_admin_principal_id(),
        user_index_canister_id,
        "get_canister_status_from_management_canister",
        candid::encode_one(alice_canister_id).unwrap(),
    ).map(|reply_payload| {
        let (response,): (CanisterStatusResponse,) = match reply_payload {
            WasmResult::Reply(payload) => candid::decode_args(&payload).unwrap(),
            _ => panic!("\n🛑 get_user_index_create_if_not_exists_else_return_canister_id_for_embedded_user_principal_id failed\n"),
        };
        response.cycles
    }).unwrap();

    println!(
        "🧪 alice_starting_cycle_balance: {}",
        alice_starting_cycle_balance
    );

    state_machine
        .execute_ingress_as(
            get_global_super_admin_principal_id(),
            CanisterId::new(PrincipalId(alice_canister_id)).unwrap(),
            "return_cycles_to_user_index_canister",
            candid::encode_one(()).unwrap(),
        )
        .unwrap();
    state_machine
        .execute_ingress_as(
            get_global_super_admin_principal_id(),
            CanisterId::new(PrincipalId(alice_canister_id)).unwrap(),
            "return_cycles_to_user_index_canister",
            candid::encode_one(()).unwrap(),
        )
        .unwrap();

    let alice_reduced_cycle_balance = state_machine.execute_ingress_as(
        get_global_super_admin_principal_id(),
        user_index_canister_id,
        "get_canister_status_from_management_canister",
        candid::encode_one(alice_canister_id).unwrap(),
    ).map(|reply_payload| {
        let (response,): (CanisterStatusResponse,) = match reply_payload {
            WasmResult::Reply(payload) => candid::decode_args(&payload).unwrap(),
            _ => panic!("\n🛑 get_user_index_create_if_not_exists_else_return_canister_id_for_embedded_user_principal_id failed\n"),
        };
        response.cycles
    }).unwrap();

    println!(
        "🧪 alice_reduced_cycle_balance: {}",
        alice_reduced_cycle_balance
    );

    state_machine
        .execute_ingress_as(
            get_global_super_admin_principal_id(),
            user_index_canister_id,
            "topup_canisters_that_need_it",
            candid::encode_one(()).unwrap(),
        )
        .unwrap();

    let alice_topped_up_cycle_balance = state_machine.execute_ingress_as(
            get_global_super_admin_principal_id(),
            user_index_canister_id,
            "get_canister_status_from_management_canister",
            candid::encode_one(alice_canister_id).unwrap(),
        ).map(|reply_payload| {
            let (response,): (CanisterStatusResponse,) = match reply_payload {
                WasmResult::Reply(payload) => candid::decode_args(&payload).unwrap(),
                _ => panic!("\n🛑 get_user_index_create_if_not_exists_else_return_canister_id_for_embedded_user_principal_id failed\n"),
            };
            response.cycles
        }).unwrap();

    println!(
        "🧪 alice_topped_up_cycle_balance: {}",
        alice_topped_up_cycle_balance
    );

    // * Assert
    assert!(alice_starting_cycle_balance > alice_reduced_cycle_balance);
    assert!(alice_reduced_cycle_balance < alice_topped_up_cycle_balance);
}
