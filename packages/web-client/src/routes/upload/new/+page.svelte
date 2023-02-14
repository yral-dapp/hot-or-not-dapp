<script lang="ts">
import Button from '$components/button/Button.svelte'
import IconButton from '$components/button/IconButton.svelte'
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte'
import PlayIcon from '$components/icons/PlayIcon.svelte'
import InputBox from '$components/input/InputBox.svelte'
import UploadLayout from '$components/layout/UploadLayout.svelte'
import { tweened } from 'svelte/motion'
import { cubicInOut } from 'svelte/easing'
import UploadStep from '$components/upload/UploadStep.svelte'
import { onMount, onDestroy, tick } from 'svelte'
import { fileToUpload } from '$stores/fileUpload'
import { goto } from '$app/navigation'
import { authState } from '$stores/auth'
import type { UploadStatus } from '$components/upload/UploadTypes'
import { checkVideoStatus, uploadVideoToStream } from '$lib/helpers/stream'
import Log from '$lib/utils/Log'
import TagsInput from '$components/tags-input/TagsInput.svelte'
import userProfile from '$stores/userProfile'
import { registerEvent } from '$components/seo/GA.svelte'
import Switch from '$components/switch/Switch.svelte'
import { individualUser } from '$lib/helpers/backend'
import { debounce } from 'throttle-debounce'

let uploadStatus: UploadStatus = 'to-upload'
let previewPaused = true
const uploadProgress = tweened(0, {
  duration: 500,
  easing: cubicInOut,
})
let videoEl: HTMLVideoElement
let videoWidth = 0
let videoHeight = 0
let videoDescription = ''
let videoHashtags = ''
let descriptionError = ''
let hashtagError = ''
let uploadStep: 'uploading' | 'processing' | 'verified' | 'not-verified' =
  'uploading'
let hashtags: string[] = []
let videoStatusInterval: any
let isInputLimitReached = false
const MAX_HASHTAG_LENGTH = 60
let videoSrc = ''
let previewMuted = true
let uploadedVideoId = 0
let enrollInHotOrNot = true

$: isInputLimitReached = videoHashtags.length >= MAX_HASHTAG_LENGTH

async function nextStep() {
  descriptionError = hashtagError = ''
  if (uploadStatus === 'to-upload') {
    if (!videoDescription) {
      descriptionError = 'Description is required'
    } else if (videoDescription.length < 10) {
      descriptionError = 'Description is too short'
    }
    if (!hashtags.length) {
      hashtagError = 'Please add at least 1 hashtag'
    }
    if (hashtagError || descriptionError) return
    if (!$authState.isLoggedIn) {
      $authState.showLogin = true
      return
    }
    startUploading()
  }
}

async function startUploading() {
  if (!$fileToUpload) return
  hashtagError = ''
  uploadStep = 'uploading'
  uploadStatus = 'uploading'
  const uploadRes = await uploadVideoToStream($fileToUpload, onProgress)
  if (!uploadRes.success) {
    Log({ ...uploadRes, source: '1 startUploading' }, 'error')
    registerEvent('video_upload_failed', {
      at_step: 'uploading_progress',
      userId: $userProfile.principal_id,
      user_canister_id: $authState.userCanisterId,
    })
    hashtagError = 'Uploading failed. Please try again'
    uploadStatus = 'to-upload'
    uploadProgress.set(0)
    return
  } else if (uploadRes.uid) {
    checkVideoProcessingStatus(uploadRes.uid)
  }
}

function onProgress(progress: number) {
  uploadProgress.set(progress * 100)
}

async function checkVideoProcessingStatus(uid: string) {
  uploadStep = 'processing'
  uploadProgress.set(100)
  videoStatusInterval = setInterval(async () => {
    try {
      const videoStatus = await checkVideoStatus(uid)
      Log({ videoStatus, source: '0 checkVideoProcessingStatus' }, 'info')
      if (!videoStatus.success) {
        clearInterval(videoStatusInterval)
        throw new Error(JSON.stringify(videoStatus))
      } else if (videoStatus.result.readyToStream) {
        handleSuccessfulUpload(uid)
        clearInterval(videoStatusInterval)
        await tick()
      }
    } catch (e) {
      Log(
        {
          error: 'Processing error',
          e,
          source: '1 checkVideoProcessingStatus',
        },
        'error',
      )
      registerEvent('video_upload_failed', {
        at_step: 'processing',
        userId: $userProfile.principal_id,
        user_canister_id: $authState.userCanisterId,
      })
      hashtagError = 'Uploading failed. Please try again'
      uploadStatus = 'to-upload'
      uploadStep = 'uploading'
      uploadProgress.set(0)
      return
    }
  }, 4000)
}

const handleSuccessfulUpload = debounce(
  10000,
  async (videoUid: string) => {
    clearInterval(videoStatusInterval)
    try {
      Log({ videoUid, source: '0 handleSuccessfulUpload' }, 'info')
      const postId = await individualUser().add_post({
        description: videoDescription,
        hashtags,
        video_uid: videoUid,
        creator_consent_for_inclusion_in_hot_or_not: enrollInHotOrNot,
      })
      uploadedVideoId = Number(postId)
      registerEvent('video_uploaded', {
        type:
          $fileToUpload instanceof File ? 'file_selected' : 'video_recorded',
        userId: $userProfile.principal_id,
        user_canister_id: $authState.userCanisterId,
        video_uid: uploadedVideoId,
      })
      uploadStep = 'verified'
      uploadStatus = 'uploaded'
      Log({ postId, source: '0 handleSuccessfulUpload' }, 'info')
    } catch (e) {
      Log(
        {
          error: "Couldn't send details to backend",
          e,
          source: '1 handleSuccessfulUpload',
        },
        'error',
      )
      registerEvent('video_upload_failed', {
        at_step: 'updating_db',
        userId: $userProfile.principal_id,
        user_canister_id: $authState.userCanisterId,
      })
      hashtagError = 'Uploading failed. Please try again'
      uploadStatus = 'to-upload'
      uploadProgress.set(0)
      return
    }
  },
  { atBegin: true },
)

async function showShareDialog() {
  const videoLink = getVideoLink()
  try {
    await navigator.share({
      title: 'Hot or Not',
      text: 'Check out this hot video I just uploaded on hotornot.wtf!',
      url: 'https://hotornot.wtf' + videoLink,
    })
  } catch (_) {}
}

function getVideoLink() {
  const username = $userProfile.username_set
    ? $userProfile.unique_user_name
    : $authState.idString
  return `/profile/${username}/post/${uploadedVideoId}`
}

onMount(async () => {
  if (!$fileToUpload) {
    goto('/upload')
  } else {
    videoSrc = URL.createObjectURL($fileToUpload)
    registerEvent('video_to_upload', {
      type: $fileToUpload instanceof File ? 'file_selected' : 'video_recorded',
      userId: $userProfile.principal_id,
    })
  }
})

onDestroy(() => {
  $fileToUpload = null
  videoEl?.pause()
  videoEl?.load()
  videoStatusInterval && clearInterval(videoStatusInterval)
})
</script>

<svelte:head>
  <title>Upload | Hot or Not</title>
</svelte:head>

<UploadLayout>
  <div slot="top-left">
    <IconButton href="/upload" preload>
      <CaretLeftIcon class="h-7 w-7 text-white" />
    </IconButton>
  </div>
  <svelte:fragment slot="top-center">Upload</svelte:fragment>
  <div
    slot="content"
    class="flex w-full flex-col items-center justify-start space-y-8 overflow-hidden overflow-y-scroll px-4 pt-10 lg:px-8">
    <div
      style={videoWidth && videoHeight
        ? `aspect-ratio: ${videoWidth}/${videoHeight}`
        : ''}
      class="relative flex max-h-64 max-w-lg items-center justify-center">
      {#if videoSrc}
        <!-- svelte-ignore a11y-media-has-caption -->
        <video
          preload="metadata"
          bind:this={videoEl}
          on:click={() => {
            previewPaused = !previewPaused
            previewMuted = false
          }}
          bind:paused={previewPaused}
          bind:videoHeight
          bind:videoWidth
          src={videoSrc}
          playsinline
          autoplay
          muted={previewMuted}
          class="h-full w-full rounded-xl bg-white/10 ring-4 ring-white/30" />
      {/if}
      {#if previewPaused}
        <div
          on:click={() => (previewPaused = false)}
          class="absolute inset-0 flex items-center justify-center"
          on:keyup>
          <IconButton class="rounded-full bg-black/50 p-4">
            <PlayIcon class="h-4 w-4" />
          </IconButton>
        </div>
      {/if}
    </div>
    {#if uploadStatus === 'to-upload'}
      <InputBox
        placeholder="Write your description here ..."
        bind:value={videoDescription}
        class="shrink-0 rounded-xl bg-white/10" />
      {#if descriptionError}
        <div class="text-xs text-red-500">{descriptionError}</div>
      {/if}
      <div class="flex w-full flex-col space-y-2">
        <span class="text-white/60">Add Hashtags</span>
        <TagsInput
          maxHashtags={8}
          placeholder="#hastag, #hastag2 ..."
          bind:value={videoHashtags}
          bind:tags={hashtags} />
      </div>

      {#if isInputLimitReached}
        <div class="text-xs text-red-500">Maximum hastags limit reached</div>
      {/if}
      {#if hashtagError}
        <div class="text-xs text-red-500">{hashtagError}</div>
      {/if}
      <div class="flex w-full items-center justify-between space-x-8">
        <span class="text-sm text-white/60">
          Do you want to include this video in hot or not?
        </span>
        <Switch bind:checked={enrollInHotOrNot} />
      </div>
    {:else}
      <div class="flex w-full flex-col space-y-10">
        <div class="flex w-full items-start space-x-4">
          <UploadStep
            step={1}
            status={uploadStep === 'uploading' ? 'active' : 'finished'} />
          <div class="flex w-full flex-col space-y-2">
            <span class="text-lg">Upload Progress</span>
            <div
              class="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div
                style="width:{$uploadProgress}%"
                class="h-full rounded-full bg-primary" />
            </div>
            <span class="text-white/60">
              {Math.ceil($uploadProgress)}% video is uploaded
            </span>
          </div>
        </div>
        <div class="flex w-full items-start space-x-4">
          <UploadStep
            step={2}
            status={uploadStep === 'uploading'
              ? 'queued'
              : uploadStep === 'processing'
              ? 'active'
              : 'finished'} />
          <div class="flex w-full flex-col space-y-2">
            <span class="text-lg">Processing Checks</span>
            {#if uploadStep === 'processing' || uploadStep == 'verified'}
              <span class="text-white/60">
                Before you publish we'll check your video for issues that may
                restrict it's visibility and other quality checks. We'll notify
                you when it's done
              </span>
            {/if}
          </div>
        </div>
        <div class="flex w-full items-start space-x-4">
          <UploadStep
            step={3}
            status={uploadStep === 'verified' ? 'finished' : 'queued'} />
          <div class="flex w-full flex-col space-y-2">
            <span class="text-lg">Final Verification</span>
            {#if uploadStep === 'verified'}
              <span class="text-white/60">
                Your video has passed all the checks.
              </span>
            {/if}
          </div>
        </div>
      </div>
    {/if}
    <div class="pt-16 pb-24">
      <div class="pb-4">
        <span class="text-primary">Note:</span>
         Once the video is uploaded on the server it can't be deleted.
      </div>
      {#if uploadStatus === 'to-upload'}
        <Button class="w-full" on:click={nextStep}>Upload Video</Button>
      {:else if uploadStatus === 'uploading'}
        <Button class="w-full" disabled on:click={nextStep}>Uploading</Button>
      {:else if uploadStatus === 'uploaded'}
        <div class="flex items-center justify-between space-x-4">
          <Button on:click={showShareDialog} type="secondary" class="w-full">
            Share Video
          </Button>
          <Button href={getVideoLink()} preload class="w-full">
            View Video
          </Button>
        </div>
      {/if}
    </div>
  </div>
</UploadLayout>
