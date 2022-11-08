#!/usr/bin/env bash
set -euo pipefail

dfx deploy --no-wallet internet_identity
export USER_ID_global_super_admin=$(dfx identity get-principal)

dfx canister create --no-wallet individual_user_template
dfx canister create --no-wallet user_index
dfx canister create --no-wallet project_member_index
dfx canister create --no-wallet post_cache

export CANISTER_ID_user_index=$(dfx canister id user_index)
export CANISTER_ID_project_member_index=$(dfx canister id project_member_index)
export CANISTER_ID_post_cache=$(dfx canister id post_cache)
export LOCAL_TOP_POSTS_SYNC_INTERVAL="10000000000"

dfx build individual_user_template
dfx build user_index
dfx build project_member_index
dfx build post_cache

cargo test

dfx canister install user_index --argument "(record {
  known_principal_ids = vec {
    record {
      variant { UserIdGlobalSuperAdmin };
      principal \"$(dfx identity get-principal)\"
    };
    record {
      variant { CanisterIdUserIndex };
      principal \"$(dfx canister id user_index)\"
    };
    record {
      variant { CanisterIdProjectMemberIndex };
      principal \"$(dfx canister id project_member_index)\"
    };
    record {
      variant { CanisterIdPostCache };
      principal \"$(dfx canister id post_cache)\"
    };
  }
})"

dfx canister install project_member_index --argument "(record {
  known_principal_ids = vec {
    record {
      variant { UserIdGlobalSuperAdmin };
      principal \"$(dfx identity get-principal)\"
    };
    record {
      variant { CanisterIdUserIndex };
      principal \"$(dfx canister id user_index)\"
    };
    record {
      variant { CanisterIdProjectMemberIndex };
      principal \"$(dfx canister id project_member_index)\"
    };
    record {
      variant { CanisterIdPostCache };
      principal \"$(dfx canister id post_cache)\"
    };
  }
})"

dfx canister install post_cache --argument "(record {
  known_principal_ids = vec {
    record {
      variant { UserIdGlobalSuperAdmin };
      principal \"$(dfx identity get-principal)\"
    };
    record {
      variant { CanisterIdUserIndex };
      principal \"$(dfx canister id user_index)\"
    };
    record {
      variant { CanisterIdProjectMemberIndex };
      principal \"$(dfx canister id project_member_index)\"
    };
    record {
      variant { CanisterIdPostCache };
      principal \"$(dfx canister id post_cache)\"
    };
  }
})"

dfx generate individual_user_template
dfx generate user_index
dfx generate project_member_index
dfx generate post_cache
