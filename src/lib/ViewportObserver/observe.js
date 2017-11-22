module.exports = (obj, callback) => {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver

  if (MutationObserver) {
    const MutationObserverConfig = {
      childList: true,
      subtree: true
    }
    const observer = new MutationObserver(callback)
    observer.observe(obj, MutationObserverConfig)
    return () => {
      observer.disconnect()
    }
  } else {
    obj.addEventListener('DOMNodeInserted', callback, false)
    obj.addEventListener('DOMNodeRemoved', callback, false)
    return () => {
      obj.removeEventListener('DOMNodeInserted', callback, false)
      obj.removeEventListener('DOMNodeRemoved', callback, false)
    }
  }
}
