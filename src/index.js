const express = require('express')

const generateJWKSet = require('./util/generateJWKSet')
const isSubdomain = require('./util/isSubdomain')

const alice = require('./personas/alice/alice')
const bob = require('./personas/bob/bob')

const personas = [ alice, bob ]

const app = express()

const config = {
  host: process.env.HOST || 'idp.test.solidproject.org',
  goodAppJWKS: generateJWKSet(),
  badAppJWKS: generateJWKSet()
}

personas.forEach((persona) => {
  persona.router(app, config)
})

app.get('/tokens$', (req, res, next) => {
  if (isSubdomain('', config.host, req.hostname)) {
    const aud = req.query.aud
    res.send(
      personas.map(
        (persona) => persona.getTokens(aud, config)
      ).flat()
    )
  } else {
    next()
  }
})


app.get('/tokens/:token_name', (req, res, next) => {
  if (isSubdomain('', config.host, req.hostname)) {
    const aud = req.query.aud
      var tokens = personas.map(
        (persona) => persona.getTokens(aud, config)
      ).flat()
      tokens.forEach((token) => {
        if (token.name === req.params.token_name) {
          res.send(token.token) // TODO: is this an OK way to exit loop?
        }
      })
  } else {
    next()
  }
})

const port = process.env.PORT || 8080

app.listen(port, () => console.log(`listening on port ${port}`))
