use candid::Principal;
use ic_state_machine_tests::{CanisterId, PrincipalId, StateMachine, WasmResult};
use shared_utils::{
    constant::DYNAMIC_CANISTER_DEFAULT_CREATION_BALANCE,
    shared_types::post::PostDetailsFromFrontend,
};

#[test]
fn when_creating_a_new_post_then_post_score_should_be_calculated() {
    // * Arrange
    let state_machine = StateMachine::new();
    let wasm =
        include_bytes!("../../../../../../target/wasm32-unknown-unknown/release/user_index.wasm");
    let alice_principal_id = PrincipalId::new_self_authenticating(&[1]);

    // * Act
    let user_index_canister_id = state_machine
        .install_canister(wasm.to_vec(), vec![], None)
        .unwrap();
    state_machine.add_cycles(
        user_index_canister_id,
        DYNAMIC_CANISTER_DEFAULT_CREATION_BALANCE as u128,
    );

    println!(
        "\n🎉 user_index_canister_id: {:?}\n",
        user_index_canister_id
    );

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

    println!(
        "\n🎉 alice_canister_id: {:?} \n",
        alice_canister_id.to_text()
    );

    let newly_created_post_id = state_machine
        .execute_ingress_as(
            alice_principal_id,
            CanisterId::new(PrincipalId(alice_canister_id)).unwrap(),
            "add_post",
            candid::encode_args((PostDetailsFromFrontend {
                description: "This is a fun video to watch".to_string(),
                hashtags: vec!["fun".to_string(), "video".to_string()],
                video_uid: "abcd#1234".to_string(),
                creator_consent_for_inclusion_in_hot_or_not: true,
            },))
            .unwrap(),
        )
        .map(|reply_payload| {
            let (newly_created_post_id,): (u64,) = match reply_payload {
                WasmResult::Reply(payload) => candid::decode_args(&payload).unwrap(),
                _ => panic!("\n🛑 add_post failed\n"),
            };
            newly_created_post_id
        })
        .unwrap();

    println!("\n🎉 Post Id: {:?} \n", newly_created_post_id);

    let post_score = state_machine
        .query_as(
            alice_principal_id,
            CanisterId::new(PrincipalId(alice_canister_id)).unwrap(),
            "get_individual_post_score_by_id",
            candid::encode_args((newly_created_post_id,)).unwrap(),
        )
        .map(|reply_payload| {
            let (post_score,): (u64,) = match reply_payload {
                WasmResult::Reply(payload) => candid::decode_args(&payload).unwrap(),
                _ => panic!("\n🛑 get_individual_post_score_by_id failed\n"),
            };
            post_score
        })
        .unwrap();

    println!("\n🎉 Post Score: {:?} \n", post_score);
    // * Assert
    assert!(post_score > 0);
}
