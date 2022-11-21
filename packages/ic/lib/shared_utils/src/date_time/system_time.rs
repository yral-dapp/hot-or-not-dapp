pub mod for_tests {
    use std::time::SystemTime;

    pub fn get_current_system_time() -> SystemTime {
        SystemTime::now()
    }
}

pub mod for_prod {
    use ic_cdk::api;
    use std::time::{Duration, SystemTime, UNIX_EPOCH};

    pub fn get_current_system_time() -> SystemTime {
        UNIX_EPOCH
            .checked_add(Duration::new(
                api::time() / 1_000_000_000,
                (api::time() % 1_000_000_000) as u32,
            ))
            .expect("Getting timestamp from ic_cdk failed")
    }
}

// #[cfg_attr(test, mockall::automock)]
// pub trait SystemTimeProvider {
//     fn get_current_system_time() -> SystemTime;
// }

// pub struct SystemTimeProviderImpl;

// impl SystemTimeProvider for SystemTimeProviderImpl {
//     fn get_current_system_time() -> SystemTime {
//         UNIX_EPOCH
//             .checked_add(Duration::new(
//                 api::time() / 1_000_000_000,
//                 (api::time() % 1_000_000_000) as u32,
//             ))
//             .expect("Getting timestamp from ic_cdk failed")
//     }
// }
