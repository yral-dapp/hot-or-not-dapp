use ic_stable_memory::{collections::hash_map::SHashMap, utils::ic_types::SPrincipal};
use shared_utils::{
    access_control::UserAccessRole,
    shared_types::{
        known_principal::KnownPrincipalMap,
        top_posts::{v0::PostScoreIndexItem, v1::PostScoreIndex},
    },
};
use std::collections::BTreeSet;

pub mod access_control;
pub mod model;
pub mod post;
pub mod score_ranking;
pub mod util;

// * Stable Variables
pub type MyKnownPrincipalIdsMap = KnownPrincipalMap;

// * Stable collections
pub type AccessControlMap = SHashMap<SPrincipal, Vec<UserAccessRole>>;
pub type PostsIndexSortedByScore = BTreeSet<PostScoreIndexItem>;
pub type PostsIndexSortedByScoreV1 = PostScoreIndex;
