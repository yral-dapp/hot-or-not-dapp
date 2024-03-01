import { authState } from '$lib/stores/auth'
import { get, writable } from 'svelte/store'

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
  //new
  'u52q7-ysdno-fbxuv-7twgg-c7kjf-in3r4-hy4fn-nyxp2-llv7l-tgrh6-cqe',
  'zmhrq-a3oso-p2l7g-fdrdk-uhnb6-cv3yj-t7sac-asohk-anyfj-ctazl-jae',
  'uazay-3xzek-q5qhb-2msrq-4a6hk-essvj-rxruj-aoj2l-pq6fh-z3sgg-2qe',
  'oyycn-hqhdn-xdpzd-hnvhc-jkona-roki3-e7s2e-xgpng-pftpc-3pnti-yqe',
  '2si6w-vzn7j-3el2b-pyykp-joh6h-qvpd5-ag7kt-zcyad-wmg5j-kxy2b-fqe',
  'dtfsr-xv2vc-xur5t-n5gn7-b3pb5-fx3bv-hnato-hovtn-sg762-e2jfi-7ae',
  'v4usp-4lwhy-v44bo-6vj7u-swddz-7q5ni-velec-5cxtl-2tdav-hsqqb-4ae',
  'r4xxf-rhgew-kiqdf-fhz3m-egvc5-movkz-yb44h-yc3av-bjrc2-ijdm6-zqe',
  'ss6du-p4742-omau7-5quj4-gihq4-rmtiw-6ov76-hugel-l5wzu-q7uoe-7ae',
  'jnyjk-mdr6v-fqfnn-f3yfx-yggzi-qzzd5-e7uu7-pw5gg-m6gmd-xturp-mae',
  'c7x5l-zu7ne-3cqmh-dvukw-3plmz-l4g5d-e4jnq-kq7a4-a2xwr-n6dob-nqe',
  'bjnxt-zjexl-z6ake-ac6hj-e3sq5-4eukt-76i37-bzqie-dbedi-m3w3j-tae',
  'yvo5u-mt53o-znm5x-p72zp-qh4tq-kdbwf-qnd7u-crke5-ophdh-cut2i-rae',
  'tfgne-7eger-rnjnu-p5wbu-nosfn-lfipc-zordr-pimte-ememd-ehyle-7ae',
  'mz3za-fahg3-deryp-j3jdu-yzbjb-kfyzl-z3z7x-srg2z-wkrt5-2zm3h-sae',
  'k2ww2-irtbo-mxwqp-fjxes-xaiqw-q56ab-2n43e-3r44m-5vdju-3w3vl-5ae',
  'wvgi6-wtzsr-bxlkb-lx4g3-2mziz-u4hqm-bjgme-3jtif-rgpe5-6lnyd-3qe',
  'd7x44-7r7az-tsuf2-nfhxh-3bzma-5aieg-vmora-2v6np-yvl53-czgia-qae',
  'h5q2e-ginhf-yox7d-fja4g-crmrm-krln7-l3afr-sfxd6-nhz6x-b64gv-3qe',
  'olxyi-a4gn6-bms5a-zss75-hcgd7-mwmes-qqfpi-dk5iy-ilmax-j3z7q-kae',
  'zpmyp-yzjif-aht3y-oujn2-5xjem-mxh47-wtxs2-y6o4m-cgc4w-4dq3i-nae',
  '6bmfx-tjxt4-4feeu-acm6g-6qdzy-pm55l-qftf4-ksbee-o4bub-rkxhe-4ae',
  'udyob-wwxvc-7iqbz-6faur-vqziw-gr7zc-qkha2-bqjr7-v3e2h-aloep-xae',
  'd7xbe-wnvlb-n7c7w-a5d7l-wbho6-hv2jw-rscf6-yelvt-bw7fm-zznkn-tqe',
  'l5mvr-mem6f-twkf3-wjnjk-iqywf-2pkcv-pzquo-72yln-wwdfp-4yv5y-lqe',
  'f6nya-ukbi7-2maj6-v5vww-czwaa-pyrna-o4dxs-bow33-fgtzg-hwto4-qqe',
]

let timer: ReturnType<typeof setInterval>
let secsPassed = 0

export const userStoryStore = writable({
  show: false,
  videoId: '',
  videoCanisterId: '',
  feedType: '',
})

export function submitUserStudyInfo(email: string, name: string) {
  const state = get(authState)
  return fetch('https://submituserstudystatus-5nps3y6y6a-uc.a.run.app', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, name, principalId: state.idString }),
  })
}

async function toShowUserStudyPopup() {
  try {
    const state = get(authState)
    const res = await fetch(
      `https://getuserstudystatus-5nps3y6y6a-uc.a.run.app?principalId=${state.idString}`,
    )
    const body = await res.json()
    return body.exists === false
  } catch (e) {
    console.error(e)
    return false
  }
}

export function monitorForUserStudy(
  userId: string,
  countTill: number,
  cb: Function,
) {
  secsPassed = 0
  clearMonitoring()
  if (!userIds.includes(userId)) return
  timer = setInterval(async () => {
    if (secsPassed > countTill) {
      clearMonitoring()
      if (await toShowUserStudyPopup()) {
        cb()
      }
    } else {
      secsPassed++
    }
  }, 1000)
}

export function clearMonitoring() {
  clearTimeout(timer)
}
