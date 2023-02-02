use ic_cdk::api::call;
use ic_stable_memory::{s, stable_memory_post_upgrade};
use individual_user_template_lib::{util::periodic_update, SVersionDetails};

#[ic_cdk_macros::post_upgrade]
fn post_upgrade() {
    // * reinitialize stable memory and variables
    stable_memory_post_upgrade(0);

    // * set schema version number received from user_index canister
    s! { SVersionDetails = SVersionDetails::get_updated_version_details(call::arg_data::<(u64, )>().0) };

    // * restart periodic update
    periodic_update::share_top_post_scores_with_post_cache_canister_v1();
}
