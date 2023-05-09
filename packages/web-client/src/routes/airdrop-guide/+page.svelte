<script lang="ts">
import IconButton from '$components/button/IconButton.svelte'
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte'
import Coin3dIcon from '$components/icons/Coin3dIcon.svelte'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import goBack from '$lib/utils/goBack'
import { navigateBack } from '$stores/navigation'

let participated = false
</script>

<svelte:head>
  <title>Airdrop Guide | Hot or Not</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    <div
      class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
      Airdrop Guide
      <div class="absolute left-4 top-4">
        <IconButton
          on:click={() => goBack($navigateBack || '/menu', true)}
          class="shrink-0">
          <CaretLeftIcon class="h-7 w-7" />
        </IconButton>
      </div>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div class="h-full w-full overflow-y-auto px-4 py-20">
      <div class="relative mx-auto block w-full max-w-2xl">
        <h4 class="text-lg font-bold">Guide</h4>
        <p>
          Hot or Not is a social media platform for short videos, similar to
          TikTok but on Web3. It integrates gamification with social media and
          is built on a ground-breaking Level-1 blockchain called the <a
            href="https://medium.com/dfinity/the-internet-computer-for-geeks-a-new-dfinity-white-paper-ecb075b2d525"
            target="_blank">
            Internet Computer Protocol
          </a>
          .
        </p>
        <p>
          Hot or Not is conducting a decentralization sale (
          <a
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
          To recognize the support of its users and early adopters, Hot or Not
          is airdropping 10 million HOT tokens (1% of the initial token supply)
          for free. This presents a unique opportunity for users to join the
          growing community and receive free tokens. It's important to note that
          HOT tokens are governance tokens on the platform, while COYN is the
          in-app utility token. COYN is not listed, while HOT tokens will be
          listed once the sale is completed.
        </p>
        <p>
          Are you interested in participating in the upcoming HOT token airdrop?
          Look no further -- We've compiled all the information you need to know
          to register and be eligible for the airdrop.
        </p>
        <h4>Registration and Eligibility</h4>
        <p>To be eligible for the airdrop, you must register here:</p>
        <a href="/airdrop" class="py-2 text-primary underline">Register Now</a>
        <p>To register, applicants must provide the following information:</p>

        <li>Email</li>
        <li>Tweet with the hashtag #hotornot and paste link</li>
        <li>Follow HotorNot on socials</li>

        <p>
          Additional information that will be taken automatically by virtue of
          login:
        </p>
        <li>Profile ID (HotOrNot)</li>
        <li>
          Current wallet balance (final balance at the end of 30 days will be
          considered for airdrop allotment)
        </li>
        <h4>Rewards</h4>
        <p>
          The number of HOT tokens allocated to one whitelisted/ waitlisted
          applicant is calculated based on their wallet balance on the cut-off
          date using the following formula:
        </p>
        <p class="rounded-md bg-primary p-2 text-center !text-white">
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
          </tbody>
        </table>
        <p>
          There are a limited number of sign-ups available on the Hot or Not
          platform before we hit the subnet limit. So hurry before we run out of
          sign-ups! The airdrop is on a first come, first serve basis.
        </p>
        <p>
          In case we reach the subnet limit, the sign-ups on the platform would
          be halted. For those who register for the airdrop post this event, the
          wallet balance would be considered as 100 COYNs on the cutoff date.
        </p>
        <p>
          The allocation of the HOT tokens from the airdrop is subject to the
          verification of NFT (if any) and the completion of proof of humanity
          by the applicant. The details would be shared with the registered
          applicants at a later date.
        </p>
      </div>
      <div>
        <div
          class="relative mx-auto mt-8 flex w-full flex-col items-center gap-4 overflow-hidden rounded-md bg-center p-8">
          <Coin3dIcon class="absolute left-2 top-4 h-5 w-5 rotate-[280deg]" />
          <Coin3dIcon class="absolute right-4 top-2 h-8 w-8 rotate-[15deg]" />
          <Coin3dIcon
            class="absolute bottom-0 left-10 h-10 w-10 rotate-[15deg]" />
          <Coin3dIcon
            class="absolute bottom-0 right-9 h-6 w-6 rotate-[320deg]" />
          <span class="text-center">
            Don't miss this opportunity to become a part of our growing
            community and receive free tokens!
          </span>
        </div>
      </div>
    </div>
  </svelte:fragment>
</HomeLayout>

<style lang="postcss">
p {
  @apply py-2 text-sm text-white/70;
}
h4 {
  @apply py-2 text-lg text-white;
}

li {
  @apply marker:text-primary;
  @apply text-sm text-white/70;
}

th {
  @apply p-1 text-left text-white;
  @apply border-[1px];
  @apply border-white/50;
  @apply bg-white/10;
}

td {
  @apply border-[1px];
  @apply p-1;
  @apply border-white/50;
}

tr:nth-child(even) {
  @apply bg-white/10;
}
</style>
