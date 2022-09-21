use crate::PostsIndexSortedByScore;
use ic_stable_memory::s;
use ic_stable_memory::utils::ic_types::SPrincipal;
use shared_utils::shared_types::top_posts::PostScoreIndexItem;

pub fn update_post_score_index_on_post_score_recalculation(post_id: u64, new_score: u64) {
    let mut posts_index_sorted_by_score = s!(PostsIndexSortedByScore);
    let post_score_index_item = PostScoreIndexItem {
        score: new_score,
        post_id,
        publisher_canister_id: SPrincipal(ic_cdk::id()),
    };
    posts_index_sorted_by_score.replace(post_score_index_item);

    // if the index exceeds 150 items, remove the excess
    if posts_index_sorted_by_score.len() > 150 {
        posts_index_sorted_by_score = posts_index_sorted_by_score.into_iter().take(100).collect();
    }

    s! { PostsIndexSortedByScore = posts_index_sorted_by_score };
}
