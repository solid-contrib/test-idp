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

app.get('/tokens', (req, res, next) => {
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

const port = process.env.PORT || 8080

app.listen(port, () => console.log(`listening on port ${port}`))
