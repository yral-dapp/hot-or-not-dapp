// use candid::{export_service, Principal};
// use shared_utils::{access_control::UserAccessRole, types::init_args::ProjectMemberIndexInitArgs};

// mod api;
// mod data;
// #[cfg(test)]
// mod test;

// #[ic_cdk_macros::init]
// #[candid::candid_method(init)]
// fn init(init_args: ProjectMemberIndexInitArgs) {}

// #[ic_cdk_macros::pre_upgrade]
// fn pre_upgrade() {}

// #[ic_cdk_macros::post_upgrade]
// fn post_upgrade() {}

// #[ic_cdk_macros::query(name = "__get_candid_interface_tmp_hack")]
// fn export_candid() -> String {
//     export_service!();
//     __export_service()
// }
