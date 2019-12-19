"use strict"

const Stream = require("stream")

const client = require("./client")
const configs = require("./configs")
// const pipe = require("./pipe")

setInterval(() => {
  client.doGet(configs.ledgerUrl).then((chain) => {
    chainingHashInspectorStream(chain)
  })
}, 1000)

const chainingHashInspectorStream = (chain) => {
  let currentPage = { pageHash: "" }

  new Stream.Readable({
    read: () => {
      const refHash = currentPage.pageHash
      currentPage = chain.shift()
      const prevHash = currentPage.pageContent.previousPageHash

      this.push({
        refHash: refHash,
        prevHash: prevHash,
      })
    },
  })
}
