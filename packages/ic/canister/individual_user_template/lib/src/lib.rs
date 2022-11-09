use ic_stable_memory::{
    collections::{hash_map::SHashMap, vec::SVec},
    utils::ic_types::SPrincipal,
};
use model::{
    post::Post, profile::UserProfile, token::UserAccountTokenDetails,
    version_details::VersionDetails,
};
use shared_utils::{
    access_control::UserAccessRole,
    shared_types::{
        known_principal::KnownPrincipalMap,
        top_posts::{v0::PostScoreIndexItem, v1::PostScoreIndex},
    },
};
use std::collections::BTreeSet;

pub mod model;
pub mod util;

// * Stable Variables
pub type Profile = UserProfile;
pub type SVersionDetails = VersionDetails;
pub type MyKnownPrincipalIdsMap = KnownPrincipalMap;
pub type TokenDetails = UserAccountTokenDetails;

// * Stable Collections
pub type AllCreatedPosts = SVec<Post>;
pub type AccessControlMap = SHashMap<SPrincipal, Vec<UserAccessRole>>;
pub type PostsIndexSortedByScore = BTreeSet<PostScoreIndexItem>;
pub type PostsIndexSortedByScoreV1 = PostScoreIndex;
pub type PrincipalsIFollow = BTreeSet<SPrincipal>;
pub type PrincipalsThatFollowMe = BTreeSet<SPrincipal>;
