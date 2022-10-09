#!/usr/bin/env bash
set -euo pipefail

dfx build --network ic post_cache
dfx canister --network ic install post_cache --mode upgrade
