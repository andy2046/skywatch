const debouncedScroll = require('./debouncedScroll')
const observe         = require('./observe')
const { inViewport }  = require('./in')

const ViewportObserver = (function () {

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

  class ViewportObserver {

    constructor (options) {
      this.opts = Object.assign({
        tolerance: 0,
        debounce: 500,
        container: window
      }, options)

      if (!(Number.isFinite(this.opts.debounce) && Number.isInteger(this.opts.debounce))) {
        throw new TypeError('Expected debounce to be finite integer')
      }

      if (!(Number.isFinite(this.opts.tolerance) && Number.isInteger(this.opts.tolerance))) {
        throw new TypeError('Expected tolerance to be finite integer')
      }

      if (typeof this.opts.container === 'string' && !!this.opts.container) {
        this._container = document.querySelector(this.opts.container)
      } else if (this.opts.container instanceof HTMLElement) {
        this._container = this.opts.container
      }

      this._container = this._container || window
      this._scroll = throttle(this.scroll.bind(this), 500)
      this.subscribedElements = {}
      this.attached = false
      this.timeout = null

      this.unobserve = observe(document.body, () => {
        Object.keys(this.subscribedElements).forEach((element) => {
          this.subscribe('enter', element)
          this.subscribe('leave', element)
        })
      })

      this.connect()

    }

    scroll () {
      this.timeout && clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
        debouncedScroll(this.subscribedElements, this.opts)
      }, this.opts.debounce)
    }

    subscribe (event, selector, callback) {
      const allowedEvents = ['enter', 'leave']

      if (!event) throw new Error('No event provided { enter or leave }')
      if (!selector) throw new Error('No selector provided')
      if (!allowedEvents.includes(event)) throw new Error(`${event} event not supported { enter or leave }`)

      if (!{}.hasOwnProperty.call(this.subscribedElements, selector)) {
        this.subscribedElements[selector] = {}
      }

      this.subscribedElements[selector].nodes = []

      const elements = document.querySelectorAll(selector)

      for (let element of elements) {
        const item = {
          isVisible: false,
          wasVisible: false,
          node: element
        }

        this.subscribedElements[selector].nodes.push(item)
      }

      if (typeof callback === 'function') {
        if (!this.subscribedElements[selector][event]) {
          this.subscribedElements[selector][event] = {}
        }

        this.subscribedElements[selector][event][(callback.name || 'anonymous')] = callback
      }
    }

    unsubscribe (event, selector, callback) {
      const enterCallbacks = Object.keys(this.subscribedElements[selector].enter || {})
      const leaveCallbacks = Object.keys(this.subscribedElements[selector].leave || {})
      const isEmpty = obj => Object.keys(obj).length === 0 && obj.constructor === Object

      if ({}.hasOwnProperty.call(this.subscribedElements, selector)) {
        if (callback) {
          if (this.subscribedElements[selector][event]) {
            const callbackName = (typeof callback === 'function') ? callback.name : callback
            delete this.subscribedElements[selector][event][callbackName]
          }
        } else {
          delete this.subscribedElements[selector][event]
        }
      }

      if (isEmpty(enterCallbacks) && isEmpty(leaveCallbacks)) {
        delete this.subscribedElements[selector]
      }
    }

    connect () {
      if (this._container instanceof HTMLElement) {
        const style = window.getComputedStyle(this._container)
        if (style.position === 'static') {
          this._container.style.position = 'relative'
        }
      }

      this._container.addEventListener('scroll', this._scroll)
      window.addEventListener('resize', this._scroll)
      this._scroll()
      this.attached = true
    }

    disconnect () {
      this._container.removeEventListener('scroll', this._scroll)
      window.removeEventListener('resize', this._scroll)
      this.unobserve()
      this.attached = false
    }
    
  }

  Object.defineProperty(ViewportObserver, 'of', {
    value: function (options) {
      return new ViewportObserver(options)
    },
    writable: false,
    enumerable: true,
    configurable: false
  })

  Object.defineProperty(ViewportObserver, 'inViewport', {
    value: function (elm, options) {
      return inViewport(elm, options)
    },
    writable: false,
    enumerable: true,
    configurable: false
  })

  return ViewportObserver
})()

module.exports = ViewportObserver
