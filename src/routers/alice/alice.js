/**
 * Alice is a law abiding citizen who has a WebID and IDP on the same server
 */
const express = require('express')
const path = require('path')

const Router = express.Router()

Router.get('/.well-known/openid-configuration', (req, res) => {
  res.sendFile(path.join(__dirname, './openid-configuration.json'))
  // res.send('OOP')
})

module.exports = Router