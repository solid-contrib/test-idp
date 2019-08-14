const { JWKS: { KeyStore } } = require('@panva/jose');

module.exports = () => {
  const keystore = new KeyStore();
  keystore.generateSync('RSA', 2048, {
    alg: 'RS256',
    use: 'sig',
  });
  return keystore
}
