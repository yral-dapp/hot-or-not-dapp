import { afterEach, expect, test } from 'vitest'
import Avatar from '../../../src/components/avatar/Avatar.svelte'

let host: HTMLElement

afterEach(() => {
  host.remove()
})

const imgSrc =
  'https://hotornot.wtf/cdn-cgi/imagedelivery/abXI9nS4DYYtyR1yFFtziA/51434d58-119c-4dc6-ea36-079498eba400/public'

test('[Component] Avatar', async () => {
  host = document.createElement('div')
  host.setAttribute('id', 'host')
  document.body.appendChild(host)
  const instance = new Avatar({
    target: host,
    props: {
      src: imgSrc,
    },
  })
  expect(instance).toBeTruthy()
  const img = host.getElementsByTagName('img')[0]
  expect(img.src).toBe(imgSrc)
})
