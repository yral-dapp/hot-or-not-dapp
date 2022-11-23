#!/usr/bin/env bash
set -euo pipefail

dfx build --network=ic individual_user_template
gzip -f -1 ./target/wasm32-unknown-unknown/release/individual_user_template.wasm
dfx build --network=ic user_index
gzip -f -1 ./target/wasm32-unknown-unknown/release/user_index.wasm
dfx build --network=ic post_cache
gzip -f -1 ./target/wasm32-unknown-unknown/release/post_cache.wasm
dfx build --network=ic project_member_index
gzip -f -1 ./target/wasm32-unknown-unknown/release/project_member_index.wasm

# cargo test

dfx canister --network=ic install user_index --mode upgrade --argument "(record {
  known_principal_ids = vec {}
})"
dfx canister --network=ic call user_index update_user_index_upgrade_user_canisters_with_latest_wasm --async
dfx canister --network=ic install post_cache --mode upgrade --argument "(record {
  known_principal_ids = vec {}
})"
dfx canister --network=ic install project_member_index --mode upgrade --argument "(record {
  known_principal_ids = vec {}
})"