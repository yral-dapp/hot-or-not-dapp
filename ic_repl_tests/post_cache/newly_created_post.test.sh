#!/home/saikat/bin/ic-repl -r http://127.0.0.1:8000/

import user_index_canister = "r7inp-6aaaa-aaaaa-aaabq-cai";

let my_canister = call user_index_canister.get_user_index_create_if_not_exists_else_return_canister_id_for_embedded_user_principal_id();

let post_id = call my_canister.add_post(record { hashtags = vec { "a"; "b"; "c" }; description = "This is post from integration test"; video_uid = "#1234567890"; creator_consent_for_inclusion_in_hot_or_not = false; });

let post_details = call my_canister.get_individual_post_details_by_id(post_id);

assert post_details.id == post_id;