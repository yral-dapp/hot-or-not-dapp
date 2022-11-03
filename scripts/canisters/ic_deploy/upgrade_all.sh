#!/usr/bin/env bash
set -euo pipefail

cargo test

dfx build --network=ic individual_user_template
dfx build --network=ic user_index
dfx build --network=ic post_cache

dfx canister --network=ic install user_index --mode upgrade --argument "(record {
  known_principal_ids = vec {}
})"
dfx canister --network=ic call user_index update_user_index_upgrade_user_canisters_with_latest_wasm --async
dfx canister --network=ic install post_cache --mode upgrade --argument "(record {
  known_principal_ids = vec {}
})"