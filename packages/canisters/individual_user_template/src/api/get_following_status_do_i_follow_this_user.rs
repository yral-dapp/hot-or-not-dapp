use candid::Principal;
use ic_stable_memory::{s, utils::ic_types::SPrincipal};

use crate::PrincipalsIFollow;

#[ic_cdk_macros::query]
#[candid::candid_method(query)]
fn get_following_status_do_i_follow_this_user(user_principal_to_check: Principal) -> bool {
    let principals_i_follow: PrincipalsIFollow = s!(PrincipalsIFollow);
    principals_i_follow.contains(&SPrincipal(user_principal_to_check))
}
