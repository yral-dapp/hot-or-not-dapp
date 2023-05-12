# hot-or-not-dapp v2

## Verify frontend build

To get the hash for the `webclient` canister:

- Get the canister ID of the `webclient` from [`canister_ids.json`](https://github.com/go-bazzinga/hot-or-not-dapp/blob/main/canister_ids.json).
- Get hash using the DFX SDK by running: `dfx canister info <canister-id> --network=ic`.
  (`<canister-id>` for [`webclient` is `vyatz-hqaaa-aaaam-qauea-cai`](https://github.com/go-bazzinga/hot-or-not-dapp/blob/main/canister_ids.json))
- The output of the above command should contain `Module hash` followed up with the hash value.

To get the hash for `webclient` canister deployment:

- Go to [Github actions deployment runs](https://github.com/go-bazzinga/hot-or-not-dapp/actions/workflows/webclient-deploy.yml)
- Open the latest run. ([Click to see an example run](https://github.com/go-bazzinga/hot-or-not-dapp/actions/runs/4900015913/jobs/8750374252))
- Go to `web-client-deploy-dapp` job. ([Click to see an example job](https://github.com/go-bazzinga/hot-or-not-dapp/actions/runs/4900015913/jobs/8750374252))
- Open `dfx deploy webclient --network ic --no-wallet` step. You should find the `Module hash` in this step. This value should match the value you got locally. ([Click to see an example step](https://github.com/go-bazzinga/hot-or-not-dapp/actions/runs/4900015913/jobs/8750374252#step:8:16))
