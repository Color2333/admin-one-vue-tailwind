// rem.js
export function setRemUnit() {
  const docEl = document.documentElement
  const ratio = 10
  const viewWidth = docEl.getBoundingClientRect().width || window.innerWidth
  docEl.style.fontSize = viewWidth / ratio + 'px'
}

export function initRem() {
  setRemUnit()
  window.addEventListener('resize', setRemUnit)
}
