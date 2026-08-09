// src/utils/deviceUtils.js

export function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export function isSafari() {
  return /safari/i.test(navigator.userAgent) &&
         !/crios|fxios/i.test(navigator.userAgent)
}

export function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches
}