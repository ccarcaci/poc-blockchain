"use strict"

const http = require("http")
const https = require("https")
const url = require("url")
const fs = require("fs")
const { SHA3, } = require("sha3")

const httpsOptions = {
  key: fs.readFileSync("./certs/privkey.pem"),
  cert: fs.readFileSync("./certs/certificate.crt"),
}

const httpPort = 3000
const httpsPort = 4443

const routing = (request, response) => {
  const action = url.parse(request.url)

  if(action.pathname === "/") { rootRoute(response) }
  else if(request.method === "GET" && action.pathname === "/ledger") { ledger(response) }
  else if(request.method === "GET" && action.pathname === "/current-page") { currentPage(response) }
  else if(request.method === "POST" && action.pathname === "/add-page") { addPage(request, response) }
  else { fallbackRoute(response) }
}

const httpServer = http.createServer((req, res) => routing(req, res))
const httpsServer = https.createServer(httpsOptions, (req, res) => routing(req, res))

httpServer.listen(httpPort, () => console.log(`HTTP Server on port ${httpPort}`))
httpsServer.listen(httpsPort, () => console.log(`HTTPS Server on port ${httpsPort}`))

// Routing Functions

const ledgerContent = [
  {
    pageContent: {
      transactions: [
        {
          payer: "",
          payee: "",
        },
      ],
      previousPageHash: "",
      proofOfWork: {
        padding: "",
      },
    },
    currentPageHash: "",
  },
]
const rootRoute = (response) => {
  response.writeHead(200, { "Content-Type": "text/plain", })
  response.write("Ledger Manager")
  response.end()
}
const fallbackRoute = (response) => {
  response.writeHead(404)
  response.end()
}

const ledger = (response) => {
  response.writeHead(200, { "Content-Type": "text/plain", })
  response.write(JSON.stringify(ledgerContent))
  response.end()
}
const currentPage = (response) => {
  response.writeHead(200, { "Content-Type": "text/plain", })
  response.write(JSON.stringify(ledgerContent.slice(-1).pop()))
  response.end()
}
const addPage = async (request, response) => {
  const pageContent = await getBody(request)
  console.log(`Received add page request, page is ${JSON.stringify(pageContent)}`)
  const powVerified = verifyPOW(pageContent)

  if(powVerified) { response.writeHead(200, { "Content-Type": "text/plain", }) }
  else { response.writeHead(422) }

  response.end()
}
const verifyPOW = (pageContent) => sha3(pageContent).slice(0, 1) === "4"
const sha3 = (pageContent) => {
  const hash = new SHA3(512)
  hash.update(JSON.stringify(pageContent))
  const digest = hash.digest().toString("hex")
  console.log(`Digest is: ${digest}`)
  return digest
}

// Server Functions

const getBody = (request) => new Promise((resolve) => {
  let body = []
  request.on("data", (chunk) => body+=chunk)
  request.on("end", () => resolve(JSON.parse(body)))
})
