"use strict"

const client = require("./client")
const configs = require("./configs")
const pipe = require("./pipe")
const crypto = require("./crypto")

setInterval(() => {
  client.doGet(configs.ledgerUrl).then((chain) => {
    pipe(chain,
      chainingHashInspector,
      hashVerification,
      isValid)
  })
}, 1000)

const chainingHashInspector = (chain) => {
  if(chain.length <= 1) { return chain }

  for(let index = 0; index < chain.length -1; index++) {
    const currentPageHash = chain[index].pageHash
    const nextPageHash = chain[index + 1].pageContent.previousPageHash

    if(currentPageHash !== nextPageHash) { return isInvalid() }
  }

  return chain
}

const hashVerification = (chain) => {
  for(let index = 0; index < chain.length - 1; index++) {
    const computatedHash = crypto.sha3(chain[index].pageContent)

    if(computatedHash !== chain[index].pageHash) { return isInvalid() }
  }

  return chain
}

const isInvalid = () => {
  console.log("Chain has been tampered")

  return []
}

const isValid = (chain) => {
  if(chain.length >= 0) { console.log("Chain is valid") }
}
