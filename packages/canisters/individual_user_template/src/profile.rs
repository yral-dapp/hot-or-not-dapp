use crate::Profile;
use ic_stable_memory::s;
use internal::UserProfile;

pub mod internal;

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_profile_details() -> UserProfile {
    s!(Profile)
}
