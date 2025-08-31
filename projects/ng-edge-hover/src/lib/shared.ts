export function prepareEnterExit(event: MouseEvent, element: HTMLElement,) {
  const rect = element.getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY

  const dTop = Math.abs(y - rect.top)
  const dRight = Math.abs(rect.right - x)
  const dBottom = Math.abs(rect.bottom - y)
  const dLeft = Math.abs(x - rect.left)
  return { dTop, dRight, dBottom, dLeft, rect, x, y };
}
