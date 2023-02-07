use speedy::{Readable, Writable};

#[derive(Readable, Writable, Default)]
pub struct VersionDetails {
    version_number: u64,
}

impl VersionDetails {
    pub fn new() -> Self {
        Self { version_number: 0 }
    }

    pub fn get_updated_version_details(new_version_number: u64) -> Self {
        Self {
            version_number: new_version_number,
        }
    }
}
