"use strict"

const https = require("https")

const runMiner = async () => {
  try {
    let lifeSpan = 9999

    while(--lifeSpan) {
      // eslint-disable-next-line no-await-in-loop
      const currentPageContent = await getCurrentPageContent()
      const pageContent = addPadding(currentPageContent)

      if(verifyProofOfWork(pageContent)) {
        addPage(pageContent)
      }
    }
  } catch(error) {
    console.log(error.message)
  }
}

runMiner()

// Miner Functions

const getCurrentPageContent = () => doGet("https://ledger-manager/current-page").pageContent
const addPadding = (pageContent) => pageContent.proofOfWork.padding = uuidv4()
const verifyProofOfWork = (pageContent) => sha3(pageContent).slice(0, 1) === "42"
const addPage = (pageContent) => doPost("https://ledger-manager/add-page", pageContent)
const uuidv4 = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (chars) => {
  const random = Math.random() * 16 | 0, value = chars === "x" ? random : (random & 0x3 | 0x8)
  return value.toString(16)
})
const sha3 = (pageContent) => pageContent

// Https Functions

const doGet = (url) => new Promise((resolve, reject) => https.get(url, (response) => {
  let data = ""
  response.on("data", (chunk) => data += chunk)
  response.on("end", resolve(data))
}).on("error", (err) => reject(err)))

const doPost = (url, content) => {
  const options = {
    hostname: url.split("/")[0],
    port: 4443,
    path: url.split("/")[1],
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": content.length,
    },
  }

  const request = https.request(options)
  request.write(content)
  request.end()
}
