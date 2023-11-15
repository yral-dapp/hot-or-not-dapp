<script lang="ts" context="module">
const links1 = [
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/01227cb1645d4ace8707f475c95e8207/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/61779c38631f45d7af30c4799e8c5f24/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/0a34ebe1846f48848fe98c6e82d5031d/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/6c22e89a72dd4a1c834447f760a24284/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/f0de3ab6ed0343ef9fb9067670a5489b/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/a9f6dbc38eb847e6877a92370cc3295a/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/247b933ee1dc48308f31fa93f1b06a68/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/c259b16247c84fa59a8839dc2e489046/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/b9a62731978a4945b7434f4c7c66b692/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/19aff896aacf4f2a8e40683e5c6521fb/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/e138e43af0f5478bbfe7b649177159d7/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/8540f84056c1471d87217471f8776713/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/34da673f6df34f52bf84ef82dff59b25/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/6f6a17f2da5441eb8214406fdf525ad2/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/dbb85867787248ad83627aa9423637ff/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/92866a1c45804122b16f1e9e6a8a00d8/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/00d5314891924a56a57e6c5bc8f91512/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/b3261513813c45ad9a67e912fb2e97e5/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/e2312fc67e7746b99d99fd5476dd7681/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/6aa86bd3e86345a69ac686e7c626b69f/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/4474956c766d433e8fa8bea35fe4cbeb/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/35a1dd0614f44efebf9379e445452d53/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/a7592cda23964f8594e09b296c304c8b/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/d41f7f01d5c74deabd332397568cb134/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/f45c7bd00f3e498da3bf921a5db09774/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/1bca7ac90c3a44c7aafc0e271928bce5/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/cac7bf5be728473b94a07512adbe785a/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/d41381f0cf4b41cab3564c03801e84f9/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/2b561b7f5d4342d4b3e2aa7e996cccb5/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/68e037c0bf9d4ef3ac61929c849e2bb5/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/154a9a9cb6774137b6ec86bde18dd173/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/0c30718643eb4cea9e28838f4ed47e22/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/0646c42aa0da49898ad7073b337f5cb9/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/d99cbf98960a4d4fa27c35cf0ef055fe/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/694b5dc14a9d4c359daa9612491d2634/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/1a5f71336dac45ebaa59c30cf60c164c/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/dc0fc160dc6a4c4c8ffb25eb4c880ca0/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/cb03726e59614c19bd29bb5d34bc38d2/manifest/video.m3u8',
  'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/6f9d86fd4b324ade9f5b188acbedde7d/manifest/video.m3u8',
]

const links2 = []
</script>

<script lang="ts">
import Slide from './Slide.svelte'
import Virtu from './Virtu.svelte'

let videos = [...links1, ...links1, ...links1, ...links1, ...links1]
let activeIndex = 0
</script>

<div
  style="overflow-anchor: auto;"
  class="hide-scrollbar relative flex h-full w-full snap-y snap-mandatory flex-col overflow-hidden overflow-y-auto">
  {#each videos as link, index (index)}
    <Virtu {index} {activeIndex} let:show>
      <Slide
        {index}
        {link}
        on:view={({ detail }) => (activeIndex = detail)}
        {show} />
    </Virtu>
  {/each}
  <div class="fixed right-0 top-0 bg-black text-5xl text-white">
    {activeIndex}
  </div>
</div>
