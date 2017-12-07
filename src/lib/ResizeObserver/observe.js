module.exports = (callback) => {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver

  if (MutationObserver) {
    const MutationObserverConfig = {
      attributes: true,
      childList: false,
      characterData: false
    }
    const observer = new MutationObserver(callback)
    observer.observe(document, MutationObserverConfig)
    return () => {
      observer.disconnect()
    }
  } else {
    document.addEventListener('DOMSubtreeModified', callback, false)
    return () => {
      document.removeEventListener('DOMSubtreeModified', callback, false)
    }
  }
}
