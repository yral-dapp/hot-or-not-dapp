export default function clickOutside(node: Node, enabled: boolean = true) {
  const handleClick = (event: MouseEvent) => {
    if (
      node &&
      !node.contains(event.target as Node) &&
      !event.defaultPrevented
    ) {
      node.dispatchEvent(
        new CustomEvent('clickOutside', node as CustomEventInit),
      )
    }
  }
  const addListener = () =>
    document.addEventListener('click', handleClick, true)
  const removeListener = () =>
    document.removeEventListener('click', handleClick, true)

  if (enabled) addListener()
  return {
    update(enabled: boolean) {
      if (enabled) {
        addListener()
      } else {
        removeListener()
      }
    },
    destroy() {
      removeListener()
    },
  }
}
