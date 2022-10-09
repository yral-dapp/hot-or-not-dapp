#!/usr/bin/env bash
set -euo pipefail

dfx build --network ic individual_user_template
dfx build --network ic user_index

dfx canister --network ic install user_index --mode upgrade
