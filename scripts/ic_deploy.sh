#!/usr/bin/env bash
set -euo pipefail

cargo test

export CANISTER_ID_user_index=$(dfx canister --network=ic id user_index)
export CANISTER_ID_post_cache=$(dfx canister --network=ic id post_cache)

dfx build --network=ic individual_user_template
dfx build --network=ic user_index
dfx build --network=ic post_cache

dfx canister --network=ic install --mode=reinstall user_index
dfx canister --network=ic install --mode=reinstall post_cache