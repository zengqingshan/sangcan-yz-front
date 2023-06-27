export default function loadJs(src, callback) {
  const HEAD = document.getElementsByTagName('head')[0] || document.documentElement
  const script = document.createElement('script')
  script.onload = script.onreadystatechange = function() {
    if (this.readyState === 'loaded' || this.readyState === 'complete') {
      this.onload = this.onreadystatechange = null
      this.parentNode.removeChild(this)
      if (typeof callback === 'function') {
        callback()
      }
    }
  }
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', src)
  HEAD.appendChild(script)
}
