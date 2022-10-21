use crate::PostsIndexSortedByScore;
use ic_cdk::api::call;
use ic_stable_memory::s;
use ic_stable_memory::utils::ic_types::SPrincipal;
use shared_utils::constant;
use shared_utils::shared_types::top_posts::v0::PostScoreIndexItem;

pub fn update_post_score_index_on_post_score_recalculation(post_id: u64, new_score: u64) {
    // ic_cdk::print(format!("🤷Before\n{:?}", s!(PostsIndexSortedByScore)));
    let mut posts_index_sorted_by_score = s!(PostsIndexSortedByScore);
    let post_score_index_item = PostScoreIndexItem {
        score: new_score,
        post_id,
        publisher_canister_id: SPrincipal(ic_cdk::id()),
    };
    ic_cdk::print(format!(
        "🤷Does post exist?: {:?}\n👋Item: {:?}",
        posts_index_sorted_by_score.contains(&post_score_index_item),
        post_score_index_item
    ));
    posts_index_sorted_by_score.replace(post_score_index_item);

    // if the index exceeds 150 items, remove the excess
    if posts_index_sorted_by_score.len() > 150 {
        posts_index_sorted_by_score = posts_index_sorted_by_score.into_iter().take(100).collect();
    }

    s! { PostsIndexSortedByScore = posts_index_sorted_by_score };
    // ic_cdk::print(format!("🤷After\n{:?}", s!(PostsIndexSortedByScore)));
}

pub fn send_top_post_scores_to_post_cache_canister() {
    // ic_cdk::print(format!("👋\n{:?}", s!(PostsIndexSortedByScore)));
    let top_post_scores: Vec<PostScoreIndexItem> = s!(PostsIndexSortedByScore)
        .iter()
        .take(3)
        .cloned()
        .collect();

    // ic_cdk::print(format!(
    //     "🤷\n {:?}",
    //     top_post_scores
    // ));

    let _ = call::notify(
        constant::get_post_cache_canister_principal_id(),
        "receive_top_posts_from_publishing_canister",
        (top_post_scores,),
    );
}
