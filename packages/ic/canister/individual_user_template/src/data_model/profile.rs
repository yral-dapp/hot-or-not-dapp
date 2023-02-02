use candid::{CandidType, Deserialize, Principal};
use ic_stable_memory::{s, utils::ic_types::SPrincipal};
use shared_utils::canister_specific::individual_user_template::types::profile::{
    UserProfileDetailsForFrontend, UserProfileGlobalStats,
};
use speedy::{Readable, Writable};

use crate::data_model::{PrincipalsIFollow, PrincipalsThatFollowMe};

#[derive(Readable, Writable, CandidType)]
pub struct UserProfile {
    display_name: Option<String>,
    unique_user_name: Option<String>,
    principal_id: SPrincipal,
    profile_picture_url: Option<String>,
    profile_stats: UserProfileGlobalStats,
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
                lifetime_earnings: 0,
                hots_earned_count: 0,
                nots_earned_count: 0,
            },
        }
    }

    pub fn get_user_profile_details_for_frontend(&self) -> UserProfileDetailsForFrontend {
        let followers = s!(PrincipalsThatFollowMe);
        let following = s!(PrincipalsIFollow);

        UserProfileDetailsForFrontend {
            principal_id: self.principal_id.0,
            display_name: self.display_name.clone(),
            unique_user_name: self.unique_user_name.clone(),
            profile_picture_url: self.profile_picture_url.clone(),
            profile_stats: self.profile_stats,
            followers_count: followers.len() as u64,
            following_count: following.len() as u64,
        }
    }

    pub fn update_profile_details(
        &mut self,
        user_profile_details: UserProfileUpdateDetailsFromFrontend,
    ) {
        self.display_name = user_profile_details.display_name;
        self.profile_picture_url = user_profile_details.profile_picture_url;
    }

    pub fn set_unique_user_name(&mut self, unique_user_name: String) {
        self.unique_user_name = Some(unique_user_name);
    }
}

#[derive(Deserialize, CandidType)]
pub struct UserProfileUpdateDetailsFromFrontend {
    pub display_name: Option<String>,
    pub profile_picture_url: Option<String>,
}
