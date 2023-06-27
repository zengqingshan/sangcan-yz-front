import Cookies from 'js-cookie'

const TokenKey = 'sessionid'

export function getToken() {
  return Cookies.get(TokenKey) || location.search.includes('ssoServer')
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}