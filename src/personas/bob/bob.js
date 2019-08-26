/**
 * Bob is a law abiding citizen who has a WebID and IDP on different servers
 */
const express = require('express')
const path = require('path')
const fs = require('fs')
const Handlebars = require('handlebars')

const generateToken = require('../../util/generateToken')
const generateJWKSet = require('../../util/generateJWKSet')
const generateCnfClaim = require('../../util/generateCnfClaim')
const isSubdomain = require('../../util/isSubdomain')

const JWKS = generateJWKSet()

module.exports.router = (app, config) => {
  const openidConfigurationTemplate = Handlebars.compile(fs.readFileSync(path.join(__dirname, './files/openid-configuration.json')).toString())
  const openidConfiguration = openidConfigurationTemplate({ host: config.host })
  const profileTemplate = Handlebars.compile(fs.readFileSync(path.join(__dirname, './files/profile.ttl')).toString())
  const profile = profileTemplate({ host: config.host })

  const IdpRouter = express.Router()
  const WebIDRouter = express.Router()

  IdpRouter.get('/.well-known/openid-configuration', (req, res) => {
    res.set('content-type', 'application/json')
    res.send(openidConfiguration)
  })
  WebIDRouter.get('/profile/card', (req, res) => {
    res.set('content-type', 'text/turtle')
    res.send(profile)
  })
  IdpRouter.get('/jwks', (req, res) => {
    res.set('content-type', 'application/json')
    res.send(JWKS.toJWKS())
  })

  app.use((req, res, next) => {
    if (isSubdomain('bobwebid', config.host, req.hostname)) {
      WebIDRouter(req, res, next)
    } else if (isSubdomain('bobidp', config.host, req.hostname)) {
      IdpRouter(req, res, next)
    } else {
      next()
    }
  })
}

module.exports.getTokens = (audience, config) => {
  return [
    {
      name: 'BOB_ID_GOOD',
      token: generateToken({
        token_type: 'id',
        iss: `https://bobidp.${config.host}`,
        iat: new Date('2000-01-01').getTime(),
        exp: new Date('2099-01-01').getTime(),
        sub: `https://bobwebid.${config.host}/profile/card#me`,
        aud: audience
      }, JWKS)
    },
    {
      name: 'BOB_POP_FOR_GOOD_APP_GOOD',
      token: generateToken({
        token_type: 'pop',
        iss: 'https://goodapp.example',
        iat: new Date('2000-01-01').getTime(),
        exp: new Date('2099-01-01').getTime(),
        aud: audience,
        id_token: generateToken({
          token_type: 'id',
          iss: `https://bobidp.${config.host}`,
          exp: new Date('2099-01-01').getTime(),
          sub: `https://bobwebid.${config.host}/profile/card#me`,
          aud: 'https://goodapp.example',
          cnf: generateCnfClaim(config.goodAppJWKS)
        }, JWKS)
      }, config.goodAppJWKS)
    },
    {
      name: 'BOB_POP_FOR_BAD_APP_GOOD',
      token: generateToken({
        token_type: 'pop',
        iss: 'https://badapp.example',
        iat: new Date('2000-01-01').getTime(),
        exp: new Date('2099-01-01').getTime(),
        aud: audience,
        id_token: generateToken({
          token_type: 'id',
          iss: `https://bobidp.${config.host}`,
          iat: new Date('2000-01-01').getMilliseconds(),
          exp: new Date('2099-01-01').getTime(),
          sub: `https://bobwebid.${config.host}/profile/card#me`,
          aud: 'https://badapp.example',
          cnf: generateCnfClaim(config.badAppJWKS)
        }, JWKS)
      }, config.badAppJWKS)
    }
  ]
}
