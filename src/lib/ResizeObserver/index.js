const ResizeObserver = (function () {

  class ResizeObserver {
    constructor (args) {
    }
  }

  Object.defineProperty(ResizeObserver, 'of', {
    value: function (args) {
      return new ResizeObserver(args)
    },
    writable: false,
    enumerable: true,
    configurable: false
  })

  return ResizeObserver
})()

module.exports = ResizeObserver
