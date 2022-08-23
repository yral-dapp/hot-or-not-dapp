use candid::{CandidType, Deserialize};
use serde::Serialize;
use speedy::{Readable, Writable};

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
pub struct PostDetailsFromFrontend {
    pub description: String,
    pub hashtags: Vec<String>,
    pub video_url: String,
}

#[derive(Readable, Writable)]
pub struct Post {
    id: u64,
    description: String,
    hashtags: Vec<String>,
    video_url: String,
    status: PostStatus,
}

impl Post {
    pub fn new(id: u64, description: String, hashtags: Vec<String>, video_url: String) -> Self {
        Post {
            id,
            description,
            hashtags,
            video_url,
            status: PostStatus::Uploaded,
        }
    }

    pub fn update_status(&mut self, status: PostStatus) {
        self.status = status;
    }
}
