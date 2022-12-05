use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use individual_user_template_lib::{
    model::token::TokenBalance, MyKnownPrincipalIdsMap, MyTokenBalance, Profile,
};
use shared_utils::{
    constant::get_user_index_canister_principal_id,
    date_time::system_time,
    types::utility_token::{v0::MintEvent, v1::TokenEventV1},
};

#[ic_cdk_macros::update]
#[candid::candid_method(update)]
fn get_rewarded_for_signing_up() {
    // * access control
    let request_maker = ic_cdk::caller();
    let known_principal_ids: MyKnownPrincipalIdsMap = s!(MyKnownPrincipalIdsMap);

    if !(get_user_index_canister_principal_id(known_principal_ids) == request_maker) {
        return;
    }

    let my_token_balance: TokenBalance = s!(MyTokenBalance);
    let profile: Profile = s!(Profile);

    let updated_token_balance = my_token_balance.handle_token_event(TokenEventV1::Mint {
        details: MintEvent::NewUserSignup {
            new_user_principal_id: SPrincipal(
                profile.get_user_profile_details_for_frontend().principal_id,
            ),
        },
        timestamp: system_time::get_current_system_time_from_ic(),
    });

    s! { MyTokenBalance = updated_token_balance };
}
