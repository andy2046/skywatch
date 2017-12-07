# skywatch
skywatch is a JavaScript library to observe selected elements enter or leave the viewport or resize.

## Examples
```js
import { ViewportObserver, ResizeObserver } from 'skywatch'

const callback = (element, event) => {
  console.log(element, event)
}

// ViewportObserver
const obs = ViewportObserver.of({ debounce: 1000, tolerance: 20, container: window })

// callback when element enter the viewport
obs.subscribe('enter', 'div.element', callback)

// callback when element leave the viewport
obs.subscribe('leave', 'div.element', callback)

// check if element is in Viewport
ViewportObserver.inViewport('div.element')

// cleanup
obs.unsubscribe('enter', 'div.element', callback)
obs.unsubscribe('leave', 'div.element', callback)
obs.disconnect()

// ResizeObserver
const reobs = ResizeObserver.of(callback)

// observe target element
reobs.observe('div.element')

// unobserve target element
reobs.unobserve('div.element')

// cleanup
reobs.disconnect()
```

## Installation

```
npm install --save skywatch
```

## Usage
You can import from `skywatch`:

```js
import { ViewportObserver, ResizeObserver } from 'skywatch'
// or
const { ViewportObserver, ResizeObserver } = require('skywatch')
```
