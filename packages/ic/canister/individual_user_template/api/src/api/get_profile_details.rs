use ic_stable_memory::s;

use crate::{internal::model::profile::UserProfileDetailsForFrontend, Profile};

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_profile_details() -> UserProfileDetailsForFrontend {
    let profile: Profile = s!(Profile);

    profile.get_user_profile_details_for_frontend()
}
