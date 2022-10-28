use crate::util::score_ranking;
use candid::{CandidType, Deserialize};
use ic_cron::types::{Iterations, SchedulingOptions};
use shared_utils::constant::{SCORE_RECALCULATION_SYNC_INTERVAL, TOP_POSTS_SYNC_INTERVAL};

ic_cron::implement_cron!();

#[derive(CandidType, Deserialize)]
enum TaskKind {
    ShareTopPostScoresWithPostCacheCanister,
    UpdatePostScoresEveryHour,
}

#[ic_cdk_macros::heartbeat]
fn heartbeat() {
    // cron_ready_tasks will only return tasks which should be executed right now
    for task in cron_ready_tasks() {
        let kind = task.get_payload::<TaskKind>().expect("Serialization error");

        match kind {
            TaskKind::ShareTopPostScoresWithPostCacheCanister => {
                score_ranking::send_top_post_scores_to_post_cache_canister();
            }
            TaskKind::UpdatePostScoresEveryHour => {
                score_ranking::update_post_scores_for_every_post_in_posts_index_sorted_by_score();
            }
        };
    }
}

pub fn share_top_post_scores_with_post_cache_canister() {
    let interval = option_env!("LOCAL_TOP_POSTS_SYNC_INTERVAL").map_or(
        TOP_POSTS_SYNC_INTERVAL,
        |string_env_value| {
            string_env_value
                .parse::<u64>()
                .unwrap_or(TOP_POSTS_SYNC_INTERVAL)
        },
    );

    let _ = cron_enqueue(
        TaskKind::ShareTopPostScoresWithPostCacheCanister,
        SchedulingOptions {
            delay_nano: 0,
            interval_nano: interval,
            iterations: Iterations::Infinite,
        },
    );
}

pub fn update_post_scores_every_hour() {
    let interval = option_env!("LOCAL_TOP_POSTS_SYNC_INTERVAL").map_or(
        SCORE_RECALCULATION_SYNC_INTERVAL,
        |string_env_value| {
            string_env_value
                .parse::<u64>()
                .unwrap_or(SCORE_RECALCULATION_SYNC_INTERVAL)
        },
    );

    let _ = cron_enqueue(
        TaskKind::UpdatePostScoresEveryHour,
        SchedulingOptions {
            delay_nano: 0,
            interval_nano: interval,
            iterations: Iterations::Infinite,
        },
    );
}
