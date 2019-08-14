const { JWT } = require('@panva/jose')

module.exports = (decodedTokenBody, JWKS) => {
  return JWT.sign(decodedTokenBody, JWKS.all()[0]);
}