const observe = require('./observe')

const ResizeObserver = (function () {
  const selector = target => [target.style.width, target.style.height,
    target.clientWidth, target.clientHeight].join('-')

  const throttle = (func, limit) => {
    let wait = false
    return function () {
      if (!wait) {
        func.apply(null, arguments)
        wait = true
        setTimeout(() => {
          wait = false
        }, limit)
      }
    }
  }

  class ResizeObservation {
    constructor (elm) {
      if (!elm) {
        throw new Error('element is required')
      }

      this.element = elm

      if (typeof elm === 'string') {
        this.element = document.querySelector(elm)
      }

      this._identity = selector(this.element)
    }

    updateIdentity () {
      this._identity = selector(this.element)
    }

    isActive () {
      // todo
    }
  }

  class ResizeObserver {
    constructor (callback) {
      if (typeof callback !== 'function') {
        throw new TypeError('Expected callback to be function')
      }

      this._callback = callback
      this.observationTargets = {}

      const _observerCallback = () => {
        for (let target in this.observationTargets) {
          let resizeObservation = this.observationTargets[target]
          if (resizeObservation._identity !== selector(resizeObservation.element)) {
            resizeObservation.updateIdentity()
            this._callback(resizeObservation.element, 'resize')
          }
        }
      }

      this._observerCallback = throttle(_observerCallback, 500)

      this.unobserver = observe(this._observerCallback)
      window.addEventListener('resize', this._observerCallback)
    }

    observe (target) {
      if (!target) {
        throw new Error('target is required')
      }

      if (!{}.hasOwnProperty.call(this.observationTargets, target)) {
        const resizeObservation = new ResizeObservation(target)
        this.observationTargets[target] = resizeObservation
      }
    }

    unobserve (target) {
      if (!target) {
        throw new Error('target is required')
      }

      if ({}.hasOwnProperty.call(this.observationTargets, target)) {
        delete this.observationTargets[target]
      }
    }

    disconnect () {
      this.unobserver()
      window.removeEventListener('resize', this._observerCallback)
      this.observationTargets = {}
    }
  }

  Object.defineProperty(ResizeObserver, 'of', {
    value: function (callback) {
      return new ResizeObserver(callback)
    },
    writable: false,
    enumerable: true,
    configurable: false
  })

  return ResizeObserver
})()

module.exports = ResizeObserver
