use crate::PostsIndexSortedByScore;
use candid::Principal;
use ic_cdk::api::call;
use ic_stable_memory::s;
use shared_utils::shared_types::top_posts::PostScoreIndexItem;

pub mod internal;

pub fn send_top_post_scores_to_post_cache_canister() {
    let top_post_scores: Vec<PostScoreIndexItem> = s!(PostsIndexSortedByScore)
        .iter()
        .take(3)
        .cloned()
        .collect();

    let _ = call::notify(
        Principal::from_text(option_env!("CANISTER_ID_post_cache").unwrap()).unwrap(),
        "receive_top_posts_from_publishing_canister",
        (top_post_scores,),
    );
}
