use candid::{CandidType, Deserialize};
use ic_kit::ic;
use ic_stable_memory::utils::ic_types::SPrincipal;
use serde::Serialize;
use speedy::{Readable, Writable};
use std::{
    collections::HashSet,
    time::{Duration, SystemTime, UNIX_EPOCH},
};

#[derive(Readable, Writable)]
pub enum PostStatus {
    Uploaded,
    Transcoding,
    CheckingExplicitness,
    BannedForExplicitness,
    ReadyToView,
    BannedDueToUserReporting,
    Deleted,
}

#[derive(Serialize, Deserialize, CandidType)]
pub enum PostViewDetailsFromFrontend {
    WatchedPartially {
        percentage_watched: u8,
    },
    WatchedMultipleTimes {
        watch_count: u8,
        percentage_watched: u8,
    },
}

#[derive(Serialize, Deserialize, CandidType)]
pub struct PostDetailsFromFrontend {
    pub description: String,
    pub hashtags: Vec<String>,
    pub video_url: String,
}

#[derive(Readable, Writable)]
pub struct PostViewStatistics {
    total_view_count: u64,
    threshold_view_count: u64,
    average_watch_percentage: u8,
}

#[derive(Readable, Writable)]
pub struct Post {
    id: u64,
    description: String,
    hashtags: Vec<String>,
    video_url: String,
    status: PostStatus,
    created_at: SystemTime,
    likes: HashSet<SPrincipal>,
    share_count: u64,
    view_stats: PostViewStatistics,
    score: u64,
}

impl Post {
    pub fn new(id: u64, description: String, hashtags: Vec<String>, video_url: String) -> Self {
        Post {
            id,
            description,
            hashtags,
            video_url,
            status: PostStatus::Uploaded,
            created_at: UNIX_EPOCH
                .checked_add(Duration::new(ic::time() / 1000, (ic::time() % 1000) as u32))
                .unwrap(),
            likes: HashSet::new(),
            share_count: 0,
            view_stats: PostViewStatistics {
                total_view_count: 0,
                threshold_view_count: 0,
                average_watch_percentage: 0,
            },
            score: 0,
        }
    }

    pub fn update_status(&mut self, status: PostStatus) {
        self.status = status;
    }

    pub fn toggle_like_status(&mut self, user_principal_id: &SPrincipal) -> bool {
        // if liked, return true & if unliked, return false
        if self.likes.contains(user_principal_id) {
            self.likes.remove(user_principal_id);

            self.recalculate_score();

            return false;
        } else {
            self.likes.insert(user_principal_id.clone());

            self.recalculate_score();

            return true;
        }
    }

    pub fn increment_share_count(&mut self) -> u64 {
        self.share_count += 1;
        self.recalculate_score();
        self.share_count
    }

    fn recalculate_average_watched(&self, percentage_watched: u8, additional_views: u8) -> u8 {
        (((self.view_stats.average_watch_percentage as u64 * self.view_stats.total_view_count)
            + (100 * (additional_views - 1)) as u64
            + percentage_watched as u64)
            / (self.view_stats.total_view_count + additional_views as u64)) as u8
    }

    fn recalculate_score(&mut self) -> u64 {
        let likes_component =
            1000 * self.likes.len() as u64 * 10 / self.view_stats.total_view_count;
        let threshold_views_component =
            1000 * self.view_stats.threshold_view_count / self.view_stats.total_view_count;
        let average_percent_viewed_component =
            1000 * self.view_stats.average_watch_percentage as u64;
        let post_share_component = 1000 * self.share_count * 100 / self.view_stats.total_view_count;

        let current_time = UNIX_EPOCH
            .checked_add(Duration::new(ic::time() / 1000, (ic::time() % 1000) as u32))
            .unwrap();
        let subtracting_factor = (current_time
            .duration_since(self.created_at)
            .unwrap_or(Duration::ZERO)
            .as_secs())
            / (60 * 60 * 4);
        let age_of_video_component = (1000 - 50 * subtracting_factor).max(0);

        self.score = likes_component
            + threshold_views_component
            + average_percent_viewed_component
            + post_share_component
            + age_of_video_component;

        return self.score;
    }

    pub fn add_view_details(&mut self, details: PostViewDetailsFromFrontend) {
        match details {
            PostViewDetailsFromFrontend::WatchedPartially { percentage_watched } => {
                assert!(percentage_watched <= 100 && percentage_watched > 0);
                self.view_stats.average_watch_percentage =
                    self.recalculate_average_watched(percentage_watched, 1);
                self.view_stats.total_view_count += 1;
                if percentage_watched > 20 {
                    self.view_stats.threshold_view_count += 1;
                }
            }
            PostViewDetailsFromFrontend::WatchedMultipleTimes {
                watch_count,
                percentage_watched,
            } => {
                assert!(percentage_watched <= 100 && percentage_watched > 0);
                self.view_stats.average_watch_percentage =
                    self.recalculate_average_watched(percentage_watched, watch_count);
                self.view_stats.total_view_count += watch_count as u64;
                if watch_count > 1 {
                    self.view_stats.threshold_view_count += (watch_count - 1) as u64;
                }
                if percentage_watched > 20 {
                    self.view_stats.threshold_view_count += 1;
                }
            }
        }

        self.recalculate_score();
    }
}
