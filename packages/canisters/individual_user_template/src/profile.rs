use ic_stable_memory::utils::ic_types::SPrincipal;
// use names::{Generator, Name};
use speedy::{Readable, Writable};

#[derive(Readable, Writable)]
pub struct UserProfile {
    display_name: String,
    unique_user_name: String,
    principal_id: SPrincipal,
    profile_picture_url: Option<String>,
}

impl UserProfile {
    // pub fn new(principal_id: SPrincipal) -> Self {
    //     Self {
    //         display_name: Generator::default().next().unwrap(),
    //         unique_user_name: Generator::with_naming(Name::Numbered).next().unwrap(),
    //         principal_id,
    //         profile_picture_url: None,
    //     }
    // }
}
