use crate::data_model::Profile;
use ic_stable_memory::s;
use shared_utils::canister_specific::individual_user_template::types::profile::UserProfileDetailsForFrontend;

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_profile_details() -> UserProfileDetailsForFrontend {
    let profile = s!(Profile);

    profile.get_user_profile_details_for_frontend()
}
