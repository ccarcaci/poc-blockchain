"use strict"

const https = require("https")
const { SHA3 } = require("sha3")
const url = require("url")
require("process").env.NODE_TLS_REJECT_UNAUTHORIZED = 0

// Https Functions

const doGet = (url) => new Promise((resolve, reject) => {
  const request = https.get(url, (response) => {
    let data = ""
    response.on("data", (chunk) => data += chunk)
    response.on("end", () => resolve(JSON.parse(data)))
  })
  request.on("error", (err) => reject(err))
  request.end()
})
const doPost = (completeUrl, content) => {
  const jsonStringContent = JSON.stringify(content)
  const action = url.parse(completeUrl)

  const options = {
    hostname: action.hostname,
    port: 4443,
    path: action.pathname,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": jsonStringContent.length,
    },
  }

  const request = https.request(options)
  request.write(jsonStringContent)
  request.end()
}

// Miner Functions

const addPadding = (pageContent) => pageContent.proofOfWork.padding = uuidv4()
const verifyPOW = (pageContent) => sha3(pageContent).slice(0, 1) === "4"
const addPage = (pageContent) => doPost("https://localhost:4443/add-page", pageContent)
const uuidv4 = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (chars) => {
  const random = Math.random() * 16 | 0, value = chars === "x" ? random : (random & 0x3 | 0x8)
  return value.toString(16)
})
const sha3 = (pageContent) => {
  const hash = new SHA3(512)
  hash.update(JSON.stringify(pageContent))
  return hash.digest().toString("hex")
}
const getCurrentPageContent = async () => {
  const page = await doGet("https://localhost:4443/current-page")
  return page.pageContent
}

// Main

setInterval(async () => {
  try {
    // eslint-disable-next-line no-await-in-loop
    const currentPageContent = await getCurrentPageContent()
    addPadding(currentPageContent)
    verifyPOW(currentPageContent) && addPage(currentPageContent)
  } catch (error) {
    console.log(error.message)
  }
}, 200)
