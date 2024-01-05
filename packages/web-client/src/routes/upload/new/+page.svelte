<script lang="ts">
import Button from '@hnn/components/button/Button.svelte'
import IconButton from '@hnn/components/button/IconButton.svelte'
import InputBox from '@hnn/components/input/InputBox.svelte'
import UploadLayout from '@hnn/components/web-client/layout/UploadLayout.svelte'
import UploadStep from '@hnn/components/upload/UploadStep.svelte'
import type { UploadStatus } from '@hnn/components/upload/UploadTypes'
import TagsInput from '@hnn/components/tags-input/TagsInput.svelte'
import { registerEvent } from '@hnn/components/analytics/GA.utils'
import Switch from '@hnn/components/switch/Switch.svelte'
import { tweened } from 'svelte/motion'
import { cubicInOut } from 'svelte/easing'
import { onMount, onDestroy, tick } from 'svelte'
import { fileToUpload } from '$lib/stores/fileUpload'
import { goto } from '$app/navigation'
import { authState } from '$lib/stores/auth'
import { checkVideoStatus, uploadVideoToStream } from '$lib/helpers/stream'
import Log from '$lib/utils/Log'
import { userProfile } from '$lib/stores/app'
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
let isNsfw = false
let showNsfwPopup = false

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
    hashtagError = 'Uploading failed. Please try again'
    uploadStatus = 'to-upload'
    uploadProgress.set(0)
    Log('error', 'Could not start uploading', {
      ...uploadRes,
      from: 'upload-new.startUploading',
    })
    registerEvent('video_upload_failed', {
      at_step: 'uploading_progress',
      userId: $userProfile.principal_id,
      user_canister_id: $authState.userCanisterId,
    })
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
      Log('info', 'Checking video processing status', {
        videoStatus,
        from: 'upload-new.checkVideoProcessingStatus',
      })

      if (!videoStatus.success) {
        clearInterval(videoStatusInterval)
        throw new Error(JSON.stringify(videoStatus))
      } else if (videoStatus.result.readyToStream) {
        handleSuccessfulUpload(uid)
        clearInterval(videoStatusInterval)
        await tick()
      }
    } catch (e) {
      Log('error', 'Could not check video processing status', {
        error: 'Processing error',
        e,
        source: 'upload-new.checkVideoProcessingStatus',
      })
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
      Log('info', 'Checking video processing status', {
        videoUid,
        from: 'upload-new.handleSuccessfulUpload',
      })
      const postRes = await individualUser().add_post_v2({
        description: videoDescription,
        is_nsfw: isNsfw,
        hashtags,
        video_uid: videoUid,
        creator_consent_for_inclusion_in_hot_or_not: enrollInHotOrNot,
      })
      if ('Ok' in postRes) {
        uploadedVideoId = Number(postRes.Ok)
        registerEvent('video_uploaded', {
          type:
            $fileToUpload instanceof File ? 'file_selected' : 'video_recorded',
          userId: $userProfile.principal_id,
          user_canister_id: $authState.userCanisterId,
          video_uid: uploadedVideoId,
        })
        uploadStep = 'verified'
        uploadStatus = 'uploaded'
        Log('info', 'Video upload successful', {
          postRes,
          from: 'upload-new.handleSuccessfulUpload',
        })
      } else {
        throw 'Error uploading video to backend'
      }
    } catch (e) {
      Log('error', 'Could not send uploaded video details to backend', {
        e,
        source: 'upload-new.handleSuccessfulUpload',
      })
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
  try {
    await navigator.share({
      title: 'Hot or Not',
      text: 'Check out this hot video I just uploaded on hotornot.wtf!',
      url: 'https://hotornot.wtf' + videoLink,
    })
  } catch (_) {}
}

$: username = $userProfile.username_set
  ? $userProfile.unique_user_name
  : $authState.idString
$: videoLink = `/profile/${username}/post/${uploadedVideoId}`

onMount(() => {
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
  videoStatusInterval && clearInterval(videoStatusInterval)
})
</script>

<svelte:head>
  <title>Upload | Hot or Not</title>
</svelte:head>

<UploadLayout>
  <div slot="top-left">
    <IconButton
      iconName="caret-left"
      iconClass="h-7 w-7 text-white"
      href="/upload"
      preload />
  </div>
  <svelte:fragment slot="top-center">Upload</svelte:fragment>
  <div
    slot="content"
    class="mx-auto flex w-full max-w-5xl flex-col items-center justify-start space-y-8 px-4 pt-10 lg:px-8">
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
          loop
          muted={previewMuted}
          class="h-full w-full rounded-xl bg-white/10 ring-4 ring-white/30" />
      {/if}
      {#if previewPaused}
        <div
          role="presentation"
          on:click={() => (previewPaused = false)}
          class="absolute inset-0 flex items-center justify-center">
          <IconButton
            iconName="play"
            iconClass="h-4 w-4"
            class="rounded-full bg-black/50 p-4" />
        </div>
      {/if}
    </div>
    {#if uploadStatus === 'to-upload'}
      <InputBox
        placeholder="Add post description ..."
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
          Is this video <button
            on:click={() => (showNsfwPopup = true)}
            class="text-primary underline">
            NSFW
          </button>
          ?
        </span>
        <Switch bind:checked={isNsfw} />
      </div>
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
    <div class="pb-24 pt-16">
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
          <Button href={videoLink} preload class="w-full">View Video</Button>
        </div>
      {/if}
    </div>
  </div>
</UploadLayout>
