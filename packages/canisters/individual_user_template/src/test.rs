use crate::export_candid;

#[test]
fn save_candid() {
    use std::env;
    use std::fs::write;
    use std::path::PathBuf;

    let dir: PathBuf = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
    write(dir.join("individual_user_template.did"), export_candid()).expect("Write failed.");
}
