#!/usr/bin/env bash
set -euo pipefail

cargo test
# dfx deploy --no-wallet internet_identity
dfx deploy --no-wallet individual_user_template
dfx generate individual_user_template
dfx deploy --no-wallet user_index
dfx generate user_index
