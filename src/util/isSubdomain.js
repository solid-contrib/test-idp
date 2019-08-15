
module.exports = (subdomain, host, requestHost) => {
  const hostArr = host.split('.')
  const requestHostArr = requestHost.split('.')
  // Check to see that the domains are the same
  hostArr.forEach((val, i) => {
    if (hostArr[hostArr.length - 1 - i] !== requestHostArr[requestHostArr.length - 1 - i]) {
      return false
    }
  })
  // Check to see that the subdomains are the same
  const subDomainArr = requestHostArr.slice(0, requestHostArr.length - hostArr.length)
  return subDomainArr.join('.') === subdomain
}