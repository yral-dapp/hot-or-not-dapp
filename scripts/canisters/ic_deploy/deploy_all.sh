#!/usr/bin/env bash

cargo test

dfx build --network=ic individual_user_template
dfx build --network=ic user_index
dfx build --network=ic post_cache

dfx canister --network=ic install user_index
dfx canister --network=ic install post_cache