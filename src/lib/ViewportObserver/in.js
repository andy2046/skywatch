const $ = require('jquery')

const inViewport = (elem, options = {}) => {
  if (!elem) {
    throw new Error('element is required in inViewport')
  }

  const opts = Object.assign({
    tolerance: false,
    container: document.body
  }, options)

  const container = $(opts.container)
  const contHeight = container.height()
  const contTop = container.scrollTop()
  const contBottom = contTop + contHeight // eslint-disable-line no-unused-vars

  const elemTop = $(elem).offset().top - (opts.container === window
    ? contTop
    : container.offset().top
  )
  const elemBottom = elemTop + $(elem).height()

  const isTotal = (elemTop >= 0 && elemBottom <= contHeight)
  const isPart = ((elemTop < 0 && elemBottom > 0) ||
    (elemTop > 0 && elemTop <= contHeight)) && opts.tolerance

  return isTotal || isPart
}

const inContainer = (elem, options = {}) => {
  if (!elem) {
    throw new Error('element is required in inContainer')
  }

  let element = elem
  const opts = Object.assign({
    tolerance: 0,
    container: ''
  }, options)

  if (typeof elem === 'string') {
    element = document.querySelector(elem)
  }

  const elmRect = element.getBoundingClientRect()

  if (!opts.container) {
    return (
      elmRect.top + opts.tolerance >= 0 &&
      elmRect.left + opts.tolerance >= 0 &&
      elmRect.right - opts.tolerance <= (window.innerWidth ||
      document.documentElement.clientWidth) &&
      elmRect.bottom - opts.tolerance <= (window.innerHeight ||
      document.documentElement.clientHeight)
    )
  }

  if (typeof opts.container === 'string') {
    opts.container = document.querySelector(opts.container)
  }

  const containerRect = opts.container.getBoundingClientRect()

  return (
    (element.offsetTop + element.clientHeight) + opts.tolerance >=
    opts.container.scrollTop &&

    (element.offsetLeft + element.clientWidth) + opts.tolerance >=
    opts.container.scrollLeft &&

    element.offsetLeft - opts.tolerance <=
    containerRect.width + opts.container.scrollLeft &&

    element.offsetTop - opts.tolerance <=
    containerRect.height + opts.container.scrollTop
  )
}

module.exports = {
  inViewport,
  inContainer
}
