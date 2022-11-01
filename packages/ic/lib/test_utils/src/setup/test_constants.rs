use ic_state_machine_tests::{Cycles, PrincipalId};

pub const CANISTER_INITIAL_CYCLES: Cycles = Cycles::new(20_000_000_000_000); // 20T

pub fn get_global_super_admin_principal_id() -> PrincipalId {
    PrincipalId::new_self_authenticating(&[0])
}

pub fn get_alice_principal_id() -> PrincipalId {
    PrincipalId::new_self_authenticating(&[1])
}

pub fn get_bob_principal_id() -> PrincipalId {
    PrincipalId::new_self_authenticating(&[2])
}

pub fn get_cathy_principal_id() -> PrincipalId {
    PrincipalId::new_self_authenticating(&[3])
}
