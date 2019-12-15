"use strict"

const http = require("http")
const https = require("https")
const url = require("url")
const fs = require("fs")

const store = require("./store").initialize()
const network = require("./network")
const logger = require("./logger")
const config = require("./config")

const httpsOptions = {
  // eslint-disable-next-line no-undef
  key: fs.readFileSync(`${__dirname}/../certs/privkey.pem`),
  // eslint-disable-next-line no-undef
  cert: fs.readFileSync(`${__dirname}/../certs/certificate.crt`),
}

const httpPort = 3000
const httpsPort = 4443
const interval = 1000

const routing = (request, response) => {
  const action = url.parse(request.url)

  if(action.pathname === "/") { rootRoute(response) }
  else if(request.method === "POST" && action.pathname === "/new-nodes") { addNodesAndPropagate(request, response) }
  else { fallbackRoute(response) }
}

network.initializeKnownNodes(config.refNodeUrl, (knownNodes) => {
  store.save(knownNodes.operators)
  logger.info(store.load())
  const httpServer = http.createServer((req, res) => routing(req, res))
  const httpsServer = https.createServer(httpsOptions, (req, res) => routing(req, res))

  httpServer.listen(httpPort, () => logger.info(`HTTP Server on port ${httpPort}`))
  httpsServer.listen(httpsPort, () => logger.info(`HTTPS Server on port ${httpsPort}`))
})

// Routing Functions

const rootRoute = (response) => {
  response.writeHead(200, { "Content-Type": "text/plain" })
  response.end()
}
const fallbackRoute = (response) => {
  response.writeHead(404)
  response.end()
}
const addNodesAndPropagate = (request, response) => {
  const knownNodes = store.load()

  response.writeHead(200, { "Content-Type": "application/json" })
  response.write(JSON.stringify(knownNodes))
  response.end()

  getBody(request)
    .then((newNodes) => {
      const unknownNodes = network.unknowns(request.url, newNodes, knownNodes)

      if(unknownNodes.size <= 0) { return }

      const allNodes = network.merge(request.url, newNodes, knownNodes)
      network.propagate(allNodes, (receivedNodes) => store.save(network.join(receivedNodes, allNodes)))
    })
    .catch((error) => logger.error(error))
}

// Server Functions

const getBody = (request) => new Promise((resolve) => {
  let body = []
  request.on("data", (chunk) => body+=chunk)
  request.on("end", () => resolve(JSON.parse(body)))
})

// Mining Functions

setInterval(() => {
  if(miner.mine()) { miner.propagate() }
}, interval)
