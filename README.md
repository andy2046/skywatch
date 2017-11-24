# skywatch
skywatch is a JavaScript library to observe selected elements enter or leave the viewport.

## Examples
```js
import { ViewportObserver, ResizeObserver } from 'skywatch'

const obs = ViewportObserver.of({ debounce: 1000, tolerance: 20, container: window })

const callback = (element, event) => {
  console.log(element, event)
}

// callback when element enter the viewport
obs.subscribe('enter', 'div.element', callback)

// callback when element leave the viewport
obs.subscribe('leave', 'div.element', callback)

// cleanup
obs.unsubscribe('enter', 'div.element', callback)
obs.unsubscribe('leave', 'div.element', callback)
obs.disconnect()
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
