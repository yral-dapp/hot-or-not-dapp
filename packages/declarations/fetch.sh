#!/usr/bin/env bash

VERSION=$(cat "./package.json" | jq -r '.version')

echo Downloading $VERSION

wget https://github.com/go-bazzinga/hot-or-not-backend-canister/releases/download/$VERSION/configuration.did -P /configuration
wget https://github.com/go-bazzinga/hot-or-not-backend-canister/releases/download/$VERSION/individual_user_template.did -P /individual_user_template
wget https://github.com/go-bazzinga/hot-or-not-backend-canister/releases/download/$VERSION/post_cache.did -P /post_cache
wget https://github.com/go-bazzinga/hot-or-not-backend-canister/releases/download/$VERSION/user_index.did -P /user_index