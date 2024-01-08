<script lang="ts">
import './style.postcss'
import Button from '@hnn/components/button/Button.svelte'
import IconButton from '@hnn/components/button/IconButton.svelte'
import HomeLayout from '@hnn/components/web-client/layout/HomeLayout.svelte'
import goBack from '$lib/utils/goBack'
import { navigateBack } from '$lib/stores/navigation'
</script>

<svelte:head>
  <title>Airdrop Guide</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    <div
      class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
      Airdrop Guide
      <div class="absolute left-4 top-4">
        <IconButton
          iconName="caret-left"
          iconClass="h-7 w-7"
          on:click={() => goBack($navigateBack || '/menu', true)}
          class="shrink-0" />
      </div>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div class="h-full w-full overflow-y-auto px-4 py-20">
      <div class="relative mx-auto block w-full max-w-2xl">
        <h4 class="text-lg font-bold">Guide</h4>
        <p>
          We are a social media platform for short videos, similar to TikTok but
          on Web3. It integrates gamification with social media and is built on
          a ground-breaking Level-1 blockchain called the
          <a
            class="underline"
            href="https://medium.com/dfinity/the-internet-computer-for-geeks-a-new-dfinity-white-paper-ecb075b2d525"
            target="_blank">
            Internet Computer Protocol
          </a>
          .
        </p>
        <p>
          We are conducting a decentralization sale (
          <a
            class="underline"
            href="https://internetcomputer.org/docs/current/developer-docs/integrations/sns/"
            target="_blank">
            SNS
          </a>
          sale) of its governance tokens, HOT. The sale aims to give users ownership
          of the platform, placing them at the center of the ecosystem. Users will
          have an active role in steering the ecosystem while receiving rewards for
          their participation.
        </p>
        <p>
          To recognize the support of its users and early adopters, we are
          airdropping HOT tokens to the users who registered in our airdrop
          before 15th July.
        </p>
        <p>
          It's important to note that HOT tokens are governance tokens on the
          platform, while COYN is the in-app utility token. COYN is not listed,
          while HOT tokens will be listed once the sale is completed. Are you
          interested in participating in the upcoming HOT token airdrop? Look no
          further -- We've compiled all the information you need to know to
          register and be eligible for the airdrop.
        </p>
        <p>
          Are you interested in participating in the upcoming HOT token airdrop?
          Look no further -- We've compiled all the information you need to know
          to register and be eligible for the airdrop.
        </p>

        <h4>Rewards</h4>
        <p>
          The number of HOT tokens allocated to one whitelisted/ waitlisted
          applicant is calculated based on their wallet balance on the cut-off
          date using the following formula:
        </p>
        <p class="rounded-md bg-primary px-2 py-3 text-center !text-white">
          Wallet Balance of the Applicant / Total Wallet Balance of all
          Applicants * 10,000,000
        </p>
        <table class="border-1 my-4 text-sm text-white/70">
          <thead>
            <tr>
              <th>Category of Applicant</th>
              <th>Wallet Balance considered on cutoff date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Regular Whitelisted Applicants</td>
              <td>In-app Wallet Balance on Cutoff Date</td>
            </tr>
            <tr>
              <td>Whitelisted Applicants who own GobGob NFTs</td>
              <td>In-app Wallet Balance on Cutoff Date + 1,000 COYNs</td>
            </tr>
            <tr>
              <td>
                Whitelisted Applicants who own Tier 1 Funded NFTs (issued in
                December 2022)
              </td>
              <td>In-app Wallet Balance on Cutoff Date + 5,000 COYNs</td>
            </tr>
            <tr>
              <td>
                Whitelisted Applicants who own Tier 2 Funded NFTs (issued in
                December 2022)
              </td>
              <td>In-app Wallet Balance on Cutoff Date + 10,000 COYNs</td>
            </tr>
            <tr>
              <td>
                Whitelisted Applicants who own Tier 3 Funded NFTs (issued in
                December 2022)
              </td>
              <td>In-app Wallet Balance on Cutoff Date + 20,000 COYNs</td>
            </tr>
            <tr>
              <td>Whitelisted Applicants who own CHAT Tokens</td>
              <td>In-app Wallet Balance on Cutoff Date + 1,000 COYNs</td>
            </tr>
            <tr>
              <td>Whitelisted Applicants who own SNS1 Tokens</td>
              <td>In-app Wallet Balance on Cutoff Date + 1,000 COYNs</td>
            </tr>
            <tr>
              <td>Whitelisted Applicants who are DSCVR Users</td>
              <td>In-app Wallet Balance on Cutoff Date + 1,000 COYNs</td>
            </tr>
          </tbody>
        </table>

        <p>
          The maximum reward per participant is 10,000 HOT tokens, regardless of
          their wallet balance, to prevent excessive token allocation and ensure
          fairness. Additionally, this measure prevents bots from taking over
          and monopolizing the airdrop, making it more accessible to genuine
          human participants.
        </p>
        <p>
          The allocation of the HOT tokens from the airdrop is subject to the
          verification of NFT (if any) and the completion of proof of humanity
          by the applicant. The details would be shared with the registered
          applicants at a later date.
        </p>
      </div>
    </div>
    <div
      class="fixed bottom-0 flex w-full items-center justify-center bg-gradient-to-t from-black to-transparent px-8 py-2">
      <Button href="/airdrop" class="w-full max-w-md !py-3">
        Check your status
      </Button>
    </div>
  </svelte:fragment>
</HomeLayout>
