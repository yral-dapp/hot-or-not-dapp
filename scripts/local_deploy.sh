#!/usr/bin/env bash
set -euo pipefail

cargo test

# dfx deploy --no-wallet internet_identity
export GLOBAL_OWNER_PRINCIPAL_ID=$(dfx identity get-principal)
dfx deploy --no-wallet user_index
dfx deploy --no-wallet post_cache
dfx canister create --no-wallet individual_user_template
dfx build individual_user_template
dfx generate individual_user_template
dfx generate user_index
dfx generate post_cache
