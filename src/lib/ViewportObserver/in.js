const inViewport = (elm, options = { tolerance: 0 }) => {
  if (!elm) {
    throw new Error('element is required in inViewport')
  }

  let element = elm

  if (typeof elm === 'string') {
    element = document.querySelector(elm)
  }

  const elmRect = element.getBoundingClientRect()

  return (
    elmRect.bottom - options.tolerance > 0 &&
    elmRect.right - options.tolerance > 0 &&
    elmRect.left + options.tolerance < (window.innerWidth ||
    document.documentElement.clientWidth) &&
    elmRect.top + options.tolerance < (window.innerHeight ||
    document.documentElement.clientHeight)
  )
}

const inContainer = (elm, options = { tolerance: 0, container: '' }) => {
  if (!elm) {
    throw new Error('element is required in inContainer')
  }

  let element = elm
  let opts = {...options}

  if (typeof elm === 'string') {
    element = document.querySelector(elm)
  }

  if (typeof options === 'string') {
    opts = {
      tolerance: 0,
      container: document.querySelector(options)
    }
  }
  if (typeof options.container === 'string') {
    opts.container = document.querySelector(options.container)
  }
  if (options instanceof HTMLElement) {
    opts = {
      tolerance: 0,
      container: options
    }
  }
  if (!opts.container) {
    throw new Error('container is required in inContainer')
  }

  const containerRect = opts.container.getBoundingClientRect()

  return (
    (element.offsetTop + element.clientHeight) - opts.tolerance >
    opts.container.scrollTop &&
    (element.offsetLeft + element.clientWidth) - opts.tolerance >
    opts.container.scrollLeft &&
    element.offsetLeft + opts.tolerance <
    containerRect.width + opts.container.scrollLeft &&
    element.offsetTop + opts.tolerance <
    containerRect.height + opts.container.scrollTop
  )
}

module.exports = {
  inViewport,
  inContainer
}
