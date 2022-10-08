#!/usr/bin/env bash

dfx build --network ic post_cache
dfx canister --network ic install post_cache --mode upgrade
