
module.exports = (key) => {
  return key.toJWKS().keys[0]
}