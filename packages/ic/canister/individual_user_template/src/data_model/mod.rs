use std::collections::{BTreeMap, BTreeSet};

use candid::{CandidType, Principal};
use ic_stable_memory::{
    collections::{hash_map::SHashMap, vec::SVec},
    utils::ic_types::SPrincipal,
};
use shared_utils::{
    access_control::UserAccessRole,
    canister_specific::individual_user_template::types::{
        post::{v0::Post, v1::Post as PostV1},
        token::TokenBalance,
    },
    common::types::known_principal::{KnownPrincipalMap, KnownPrincipalMapV1},
    types::top_posts::{v0::PostScoreIndexItem, v1::PostScoreIndex},
};

use self::{
    profile::{v0::UserProfile, v1::UserProfile as UserProfileV1},
    version_details::VersionDetails,
};

pub mod hot_or_not;
pub mod profile;
pub mod version_details;

// * Stable Variables
pub type Profile = UserProfile;
pub type SVersionDetails = VersionDetails;
pub type MyKnownPrincipalIdsMap = KnownPrincipalMap;
pub type MyTokenBalance = TokenBalance;

// * Stable Collections
pub type AllCreatedPosts = SVec<Post>;
pub type AccessControlMap = SHashMap<SPrincipal, Vec<UserAccessRole>>;
pub type PostsIndexSortedByScore = BTreeSet<PostScoreIndexItem>;
pub type PostsIndexSortedByHomeFeedScore = PostScoreIndex;
pub type PostsIndexSortedByHotOrNotFeedScore = PostScoreIndex;
pub type PrincipalsIFollow = BTreeSet<SPrincipal>;
pub type PrincipalsThatFollowMe = BTreeSet<SPrincipal>;
pub type AllCreatedPostsV1 = SVec<PostV1>;

#[derive(Default, CandidType)]
pub struct CanisterData {
    // Key is Post ID
    pub all_created_posts: BTreeMap<u64, PostV1>,
    pub known_principal_ids: KnownPrincipalMapV1,
    pub my_token_balance: TokenBalance,
    pub posts_index_sorted_by_home_feed_score: PostScoreIndex,
    pub posts_index_sorted_by_hot_or_not_feed_score: PostScoreIndex,
    pub principals_i_follow: BTreeSet<Principal>,
    pub principals_that_follow_me: BTreeSet<Principal>,
    pub profile: UserProfileV1,
    pub version_details: VersionDetails,
}
