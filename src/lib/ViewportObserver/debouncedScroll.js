const { inViewport, inContainer } = require('./in')

module.exports = (subscribedElements = {}, options = { tolerance: 0 }) => {
  const selectors = Object.keys(subscribedElements)
  let testVisibility

  if (!selectors.length) return

  if (options.container === window || options.container === document.body) {
    testVisibility = inViewport
  } else {
    testVisibility = inContainer
  }

  selectors.forEach((selector) => {
    subscribedElements[selector].nodes.forEach((item) => {
      if (testVisibility(item.node, options)) {
        item.wasVisible = item.isVisible
        item.isVisible = true
      } else {
        item.wasVisible = item.isVisible
        item.isVisible = false
      }
      if (item.isVisible === true && item.wasVisible === false) {
        if (!subscribedElements[selector].enter) return

        Object.keys(subscribedElements[selector].enter).forEach((callback) => {
          if (typeof subscribedElements[selector].enter[callback] === 'function') {
            subscribedElements[selector].enter[callback](item.node, 'enter')
          }
        })
      }
      if (item.isVisible === false && item.wasVisible === true) {
        if (!subscribedElements[selector].leave) return

        Object.keys(subscribedElements[selector].leave).forEach((callback) => {
          if (typeof subscribedElements[selector].leave[callback] === 'function') {
            subscribedElements[selector].leave[callback](item.node, 'leave')
          }
        })
      }
    })
  })
}
