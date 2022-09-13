use candid::{CandidType, Principal};
use ic_stable_memory::utils::ic_types::SPrincipal;
// use shared_utils::generated::generate_random_names;
use speedy::{Readable, Writable};

#[derive(Readable, Writable, CandidType)]
pub struct UserProfile {
    display_name: Option<String>,
    unique_user_name: Option<String>,
    principal_id: SPrincipal,
    profile_picture_url: Option<String>,
    profile_stats: UserProfileGlobalStats,
}

#[derive(Readable, Writable, CandidType)]
pub struct UserProfileGlobalStats {
    lover_count: u64,
    lifetime_earnings: u64,
    hots_earned_count: u64,
    nots_earned_count: u64,
}

#[derive(CandidType)]
pub struct PostAttachedUserProfileDetailsForFrontend {
    pub principal_id: Principal,
    pub display_name: Option<String>,
    pub profile_picture_url: Option<String>,
}

impl UserProfile {
    pub fn new(principal_id: Principal) -> Self {
        // let generated_name = generate_random_names(principal_id).await;

        Self {
            display_name: None,
            unique_user_name: None,
            principal_id: SPrincipal(principal_id),
            profile_picture_url: None,
            profile_stats: UserProfileGlobalStats {
                lover_count: 0,
                lifetime_earnings: 0,
                hots_earned_count: 0,
                nots_earned_count: 0,
            },
        }
    }

    pub fn get_post_attached_user_profile_details_for_frontend(
        &self,
    ) -> PostAttachedUserProfileDetailsForFrontend {
        PostAttachedUserProfileDetailsForFrontend {
            principal_id: self.principal_id.0,
            display_name: self.display_name.clone(),
            profile_picture_url: self.profile_picture_url.clone(),
        }
    }
}
