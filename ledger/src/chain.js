"use strict"

const logger = require("./logger")
const crypto = require("./crypto")
const pipe = require("./pipe")

const duplicate = (content) => pipe(content)(JSON.stringify, JSON.parse)

const addPage = (theChain, newPage) => pipe(theChain)(duplicate, (dupChain) => [ ...dupChain, newPage ])
const chainingHashInspector = (theChain) => {
  if(theChain.length <= 1) { return theChain }

  for(let index = 0; index < theChain.length -1; index++) {
    const currentPageHash = theChain[index].pageHash
    const nextPageHash = theChain[index + 1].pageContent.previousPageHash

    if(currentPageHash !== nextPageHash) { return undefined }
  }

  return theChain
}
const hashVerification = (theChain) => {
  for(let index = 0; index < theChain.length - 1; index++) {
    const computatedHash = crypto.sha3(theChain[index].pageContent)

    if(computatedHash !== theChain[index].pageHash) { return undefined }
  }

  return theChain
}
const tampering = (theChain) => {
  const currentChain = duplicate(theChain)
  if(currentChain.length >= 2) {
    currentChain[1].pageContent.transactions = [ { eenie: "meenie", ...currentChain[1].pageContent.transactions } ]
  }

  return currentChain
}

module.exports = {
  addTransaction: (theChain, transaction) => {
    const currentChain = duplicate(theChain)
    const currentPage = currentChain
      .slice(-1)
      .pop()
      .pageContent
    currentPage.transactions = [ transaction, ...currentPage.transactions ]

    return currentChain
  },
  mine: (theChain) => {
    let currentChain = duplicate(theChain)
    const currentPage = currentChain
      .slice(-1)
      .pop()
    if(currentPage.pageContent.transactions.length <= 0) { return }

    currentPage.pageContent.padding = crypto.uuidv4()
    currentPage.pageHash = crypto.sha3(currentPage.pageContent)

    logger.info(`Mining, current POW: ${currentPage.pageHash}`)

    if(crypto.verifyPOW(currentPage.pageHash)) {
      const newPage = {
        pageContent: {
          transactions: [ ],
          previousPageHash: currentPage.pageHash,
          padding: "",
        },
        pageHash: "",
      }

      currentChain = addPage(currentChain, newPage)
    }

    return currentChain
  },
  inspect: (theChain) => pipe(
    theChain,
    () => true)(
      chainingHashInspector,
      hashVerification),
  tamper: (theChain) => pipe(theChain)(tampering)
}
