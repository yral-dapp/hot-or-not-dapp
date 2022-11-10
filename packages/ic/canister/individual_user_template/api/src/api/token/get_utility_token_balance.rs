use ic_stable_memory::s;
use individual_user_template_lib::MyTokenBalance;

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_utility_token_balance() -> u64 {
    let my_token_balance: MyTokenBalance = s!(MyTokenBalance);

    my_token_balance.get_utility_token_balance()
}
