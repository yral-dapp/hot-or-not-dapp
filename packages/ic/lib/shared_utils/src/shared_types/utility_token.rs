use ic_stable_memory::utils::ic_types::SPrincipal;

pub enum MintEvent {
    NewUserSignup {
        new_user_principal_id: SPrincipal,
    },
    Referral {
        referree_user_principal_id: SPrincipal,
        referrer_user_principal_id: SPrincipal,
    },
}

pub enum TokenEvent {
    Mint(MintEvent),
    Burn,
    Transfer,
}
