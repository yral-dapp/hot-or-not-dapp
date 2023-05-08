<script lang="ts">
import IconButton from '$components/button/IconButton.svelte'
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte'
import Coin3dIcon from '$components/icons/Coin3dIcon.svelte'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import WaitlistForm from '$components/waitlist-form/WaitlistForm.svelte'
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
    <div class="h-full w-full overflow-y-auto px-2 py-24">
      <div class="relative mx-auto block w-full max-w-2xl">
        <p>A Comprehensive Guide to the HOT Token Airdrop</p>
        <p>
          Are you interested in participating in the upcoming HOT token airdrop?
          Look no further - We've compiled all the information you need to know
          to register and be eligible for the airdrop.
        </p>
        <p>
          Hot or Not is airdropping 10,000,000 HOT tokens (1% of the initial
          token supply) for its users and early adopters. This is a unique
          opportunity to receive free tokens and become a part of our growing
          community.
        </p>
        <p>Registration and Eligibility</p>
        <p>To be eligible for the airdrop, you must register here:</p>
        <a href="#" class="text-primary underline">Register Now</a>
        <p>To register, applicants must provide the following information:</p>
        <ul>
          <li>Email</li>
          <li>Tweet with the hashtag #hotornot and paste link</li>
          <li>Follow HotorNot on socials</li>
        </ul>
        <p>
          Additional information that will be taken automatically by virtue of
          login:
        </p>
        <li>Profile ID (HotOrNot)</li>
        <li>
          Current wallet balance (final balance at the end of 30 days will be
          considered for airdrop allotment)
        </li>
        <p>Rewards</p>
        <p>
          The number of HOT tokens allocated to one whitelisted/ waitlisted
          applicant is calculated based on their wallet balance on the cut-off
          date using the following formula:
        </p>
        <p class="rounded-md bg-primary p-2 text-center">
          Wallet Balance of the Applicant / Total Wallet Balance of all
          Applicants * 10,000,000
        </p>
        <table>
          <thead>
            <tr>
              <th>Category of Applicant</th>
              <th>Wallet Balance considered on Cutoff Date</th>
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
          class="relative mx-auto flex w-fit flex-col items-center gap-4 rounded-md bg-center">
          <Coin3dIcon class="absolute -left-8 -top-4 h-5 w-5 rotate-[280deg]" />
          <Coin3dIcon class="absolute -right-8 -top-8 h-8 w-8 rotate-[15deg]" />
          <Coin3dIcon
            class="absolute -left-14 bottom-0 h-10 w-10 rotate-[15deg]" />
          <Coin3dIcon
            class="absolute -right-4 bottom-0 h-6 w-6 rotate-[320deg]" />
          <span>
            Don't miss this opportunity to become a part of our growing
            community and receive free tokens!
          </span>
        </div>
      </div>
    </div>
  </svelte:fragment>
</HomeLayout>
