// pub mod for_tests {
//     use std::time::SystemTime;

//     pub fn get_current_system_time() -> SystemTime {
//         SystemTime::now()
//     }
// }

// pub mod for_prod {
//     use ic_cdk::api;
//     use std::time::{Duration, SystemTime, UNIX_EPOCH};

//     pub fn get_current_system_time() -> SystemTime {
//         UNIX_EPOCH
//             .checked_add(Duration::new(
//                 api::time() / 1_000_000_000,
//                 (api::time() % 1_000_000_000) as u32,
//             ))
//             .expect("Getting timestamp from ic_cdk failed")
//     }
// }

// #[cfg(test)]
// use mockall::automock;

// #[cfg_attr(test, automock)]
// pub trait SystemTimeProvider {
//     fn get_current_system_time() -> SystemTime;
// }

use ic_cdk::api;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

pub fn get_current_system_time_from_ic() -> SystemTime {
    UNIX_EPOCH
        .checked_add(Duration::new(
            api::time() / 1_000_000_000,
            (api::time() % 1_000_000_000) as u32,
        ))
        .expect("Getting timestamp from ic_cdk failed")
}
