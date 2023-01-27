import { tick } from 'svelte'
import { afterEach, expect, test } from 'vitest'
import Accordion from '../../../src/components/accordion/Accordion.svelte'

let host: HTMLElement

afterEach(() => {
  host.remove()
})

test('[Component] Accordion', async () => {
  host = document.createElement('div')
  host.setAttribute('id', 'host')
  document.body.appendChild(host)
  const instance = new Accordion({ target: host, props: { expanded: false } })
  expect(instance).toBeTruthy()
  const btn = host.getElementsByTagName('button')[0]
  btn.click()
  await tick()
  expect(host.innerHTML).toContain('-')
  btn.click()
  await tick()
  expect(host.innerHTML).toContain('+')
})
