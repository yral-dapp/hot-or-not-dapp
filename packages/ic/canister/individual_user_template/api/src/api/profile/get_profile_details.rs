use ic_stable_memory::s;
use individual_user_template_lib::{model::profile::UserProfileDetailsForFrontend, Profile};

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_profile_details() -> UserProfileDetailsForFrontend {
    let profile: Profile = s!(Profile);

    profile.get_user_profile_details_for_frontend()
}
