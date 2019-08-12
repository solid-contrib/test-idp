const express = require('express')
const subdomain = require('express-subdomain')

const aliceRouter = require('./routers/alice/alice')
const bobRouter = require('./routers/bob/bob')
const charlieRouter = require('./routers/charlie/charlie')

const app = express()

app.use(subdomain('alice', aliceRouter))
app.use(subdomain('bob', bobRouter))
app.use(subdomain('charlie', charlieRouter))

const port = process.env.PORT || 8080

app.listen(port, () => console.log(`listening on port ${port}`))
