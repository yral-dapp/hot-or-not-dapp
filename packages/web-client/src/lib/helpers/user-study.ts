import { writable } from 'svelte/store'

const userIds = [
  'u57sz-naryw-yfcd3-wv3ia-ed7fy-jtrdc-sc3t4-6dvtj-xpjrd-7osjq-wae',
  'tnfyw-bzj2k-md6fb-khnl3-jlpek-bxfrb-b2hz7-iingi-obcl7-6mml5-eqe',
  'exwi3-y7fp6-vilnx-waih4-xkomk-ahku5-o7f2c-jmvqk-giqiu-hsae3-2qe',
  '7kkig-kjb7v-ypozf-jvql5-lwt3k-2x43j-os26v-dq6ce-ahksr-fd3ci-4ae',
  'oni4r-4crzu-hk4hc-jwusy-bhe2w-yoduy-dpmzr-yaq2c-g2t6e-jvcc6-mqe',
  'aj32a-qkwhb-xmcq3-hxn5k-zsr6d-g7ltu-ool4m-3zcpz-ffdq7-gws7c-kqe',
  'udyob-wwxvc-7iqbz-6faur-vqziw-gr7zc-qkha2-bqjr7-v3e2h-aloep-xae',
  '2si6w-vzn7j-3el2b-pyykp-joh6h-qvpd5-ag7kt-zcyad-wmg5j-kxy2b-fqe',
  'hhd7n-mysct-jxdfm-w7mut-eawiv-r3vqu-bhasy-6ev4q-nqjeh-bkunb-qqe',
  '6o64l-6etzv-pmhvm-hn65b-wmdpa-gxgjf-fk6dw-vpgch-ifnda-j4ix3-rae',
  'l4nef-dcys2-ni3pv-gtey5-tvvie-duj7x-efafr-bstrz-3bros-ri6w4-wae',
  'xq4ew-wgsvy-bmksn-6zyu2-s75s5-75w75-db63p-ip742-jhvco-luntb-jae',
  '6pxcz-2hbp5-gdtc3-rw5ua-fkv2u-bqzad-ojxgv-7p2af-sylhp-6sv3o-qae',
  '6srxm-6diad-ojbsd-duexj-l6blj-naaui-xoi4v-hdrt7-xnvau-43z5i-7qe',
  'jnn22-42fgz-ixngd-tzowm-aogh6-st5cd-qkvgv-744jv-6pwxm-acirm-iqe',
  '2p5vw-tro4x-b4wc7-ak3xy-r6ic6-2x3ux-o73zd-62x6a-tdxzs-jqxqz-wqe',
  'p4b62-gpymu-yxmtk-iwjhs-jupgo-7yckb-wha7u-vqgh2-sz6gu-pcyyt-xqe',
  'giuhb-ncur2-mpjsp-zdi6y-obyni-dbwbk-3hcri-sb4zs-s6jim-v4vc2-6ae',
  'olxyi-a4gn6-bms5a-zss75-hcgd7-mwmes-qqfpi-dk5iy-ilmax-j3z7q-kae',
  'rluoo-q47rz-qhdln-obk7p-xmpyv-tavq2-b5gev-6pxun-3m5mb-2ijro-wae',
  'gv7qz-lmb7m-ag54v-rctzt-lq6cj-ogivv-sbewh-rxtkm-aj2jo-vf4od-6ae',
  '7qlll-ortry-acdtx-7etvo-p5a5x-pz72w-oa3na-turoe-nxts3-foeg5-eae',
  'ep6fp-p65ca-5ojke-hry3p-lnai6-mrrxh-pgl2r-xnb77-mnrlb-6q6jf-2qe',
  'v7zas-drykq-aqsli-fvgl2-64sd5-upz66-5lgc7-sy64d-v3tqf-myyho-hae',
]

let timer: ReturnType<typeof setInterval>
let secsPassed = 0

export const showUserStudyPopup = writable(false)

export function monitorForUserStudy(userId: string, countTill: number) {
  console.log('start:monitorForUserStudy')
  secsPassed = 0
  clearMonitoring()
  if (!userIds.includes(userId)) return
  timer = setInterval(() => {
    if (secsPassed > countTill) {
      console.log('TRIGGER++')
      clearMonitoring()
      showUserStudyPopup.set(true)
    } else {
      console.log('monitorForUserStudy++')
      secsPassed++
    }
  }, 1000)
}

export function clearMonitoring() {
  clearTimeout(timer)
}
