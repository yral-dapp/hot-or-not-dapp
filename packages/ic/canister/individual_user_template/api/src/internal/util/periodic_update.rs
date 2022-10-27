use candid::{CandidType, Deserialize};
use ic_cron::types::{Iterations, SchedulingOptions};
use shared_utils::constant::TOP_POSTS_SYNC_INTERVAL;

use crate::internal::util::score_ranking;

ic_cron::implement_cron!();

#[derive(CandidType, Deserialize)]
enum TaskKind {
    ShareTopPostScoresWithPostCacheCanister,
    UpdatePostScoresEvery30Minutes,
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
            TaskKind::UpdatePostScoresEvery30Minutes => {}
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
