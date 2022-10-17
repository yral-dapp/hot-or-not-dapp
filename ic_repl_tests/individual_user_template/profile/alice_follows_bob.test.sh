#!/home/saikat/bin/ic-repl -r http://127.0.0.1:8000/

import user_index_canister = "r7inp-6aaaa-aaaaa-aaabq-cai";

identity bob "~/.config/dfx/identity/bob/identity.pem";

let bob_canister = call user_index_canister.get_user_index_create_if_not_exists_else_return_canister_id_for_embedded_user_principal_id();

let response = call bob_canister.get_profile_details();

identity alice "~/.config/dfx/identity/alice/identity.pem";

let alice_canister = call user_index_canister.get_user_index_create_if_not_exists_else_return_canister_id_for_embedded_user_principal_id();

call alice_canister.update_principals_i_follow_toggle_list_with_principal_specified(response.principal_id);