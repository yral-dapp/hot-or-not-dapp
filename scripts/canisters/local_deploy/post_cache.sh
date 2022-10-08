#!/usr/bin/env bash
set -euo pipefail

export GLOBAL_OWNER_PRINCIPAL_ID=$(dfx identity get-principal)

dfx canister create --no-wallet user_index
dfx canister create --no-wallet post_cache

export CANISTER_ID_user_index=$(dfx canister id user_index)
export CANISTER_ID_post_cache=$(dfx canister id post_cache)
export LOCAL_TOP_POSTS_SYNC_INTERVAL="10000000000"

dfx build post_cache

cargo test --package post_cache

dfx canister install post_cache --mode upgrade

dfx generate post_cache
