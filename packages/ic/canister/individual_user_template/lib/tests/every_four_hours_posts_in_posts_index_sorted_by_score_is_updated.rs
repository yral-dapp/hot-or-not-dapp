use candid::Principal;
use ic_state_machine_tests::{CanisterId, PrincipalId, StateMachine, WasmResult};
use shared_utils::shared_types::post::PostDetailsFromFrontend;
use std::time::Duration;
use test_utils::setup::{
    initialize_test_env_with_known_canisters::{
        get_initialized_env_with_provisioned_known_canisters, KnownCanisters,
    },
    test_constants::get_alice_principal_id,
};

#[test]
fn every_hour_post_scores_in_posts_index_sorted_by_score_is_updated_and_every_four_hours_score_reduces_owing_to_freshness_component(
) {
    // * Arrange
    let state_machine = StateMachine::new();
    let KnownCanisters {
        user_index_canister_id,
        ..
    } = get_initialized_env_with_provisioned_known_canisters(&state_machine);
    let alice_principal_id = get_alice_principal_id();

    println!("🧪 user_index_canister_id: {:?}", user_index_canister_id);

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

    // * Every four hours, score reduces owing to the freshness component
    state_machine.advance_time(Duration::from_secs(4 * 60 * 60));
    state_machine.tick();

    let updated_post_score = state_machine
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

    // * Assert
    assert!(post_score > updated_post_score);
}
