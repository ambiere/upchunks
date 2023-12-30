require('dotenv').config()
const app = require('../server/server')
const pkg = require('../../package.json')
const serverStartUpLog = require('../server/util/serverStartUpLog')

const port = process.env.PORT || 3000
const server = app.listen(port, '0.0.0.0', () => {
  serverStartUpLog(server.address(), pkg)
})
