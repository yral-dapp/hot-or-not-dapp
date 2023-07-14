<script lang="ts">
import './guide-styles.postcss'

import Button from '$components/button/Button.svelte'
import IconButton from '$components/button/IconButton.svelte'
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte'
import Coin3dIcon from '$components/icons/Coin3dIcon.svelte'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import goBack from '$lib/utils/goBack'
import { navigateBack } from '$stores/navigation'
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
          is built on a ground-breaking Level-1 blockchain called the
          <a
            class="underline"
            href="https://medium.com/dfinity/the-internet-computer-for-geeks-a-new-dfinity-white-paper-ecb075b2d525"
            target="_blank">
            Internet Computer Protocol
          </a>
          .
        </p>
        <p>
          Hot or Not is conducting a decentralization sale (
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
          To recognize the support of its users and early adopters, Hot or Not
          is airdropping 10 million HOT tokens (1% of the initial token supply)
          for free. This presents a unique opportunity for users to join the
          growing community and receive free tokens.
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

        <h4>Registration and Eligibility</h4>

        <p>
          Registration is required to participate in the airdrop. To register,
          please click the 'Register' button located at the bottom of this page
          and follow the steps below:
        </p>

        <p>Registration process:</p>

        <li>Login through Google or Internet Identity</li>
        <li>
          The following information will be taken automatically upon login:
          <div class="pl-4 pt-1">
            <li>Principal ID (HotOrNot)</li>
            <li>
              Current wallet balance (final balance on 15th July, 2023 12PM UTC
              will be considered for airdrop allotment)
            </li>
          </div>
        </li>
        <li>
          Fill out the airdrop form with the following details:
          <div class="pl-4 pt-1">
            <li>Email</li>
            <li>A tweet with the hashtag #hotornot and paste link</li>
          </div>
        </li>
        <p>
          Optional information for additional rewards:

          <li>Plug Principal ID holding Gob-Gob NFT</li>
          <li>Plug Principal ID holding Hot or Not Funded NFT</li>
          <li>NNS Principal ID holding SNS-1 Token</li>
          <li>NNS Principal ID holding Chat Token</li>
          <li>DSCVR Principal ID for DSCVR users</li>
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
    <div
      class="fixed bottom-0 flex w-full items-center justify-center bg-gradient-to-t from-black to-transparent px-8 py-2">
      <Button href="/airdrop" class="w-full max-w-md !py-3">Register</Button>
    </div>
  </svelte:fragment>
</HomeLayout>
