"use strict"

const logger = require("./logger")
const store = require("./store")
const crypto = require("./crypto")
const pipe = require("./pipe")

const theChain = store.initialize()

theChain.save([
  {
    pageContent: {
      transactions: [ ],
      previousPageHash: "",
      padding: "",
    },
    pageHash: "",
  },
])

const addPage = (theChain, newPage) => [ ...theChain, newPage ]
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
  if(theChain.length >= 2) {
    theChain[1].transactions = [ { eenie: "meenie", ...theChain[1].transactions } ]
  }

  return theChain
}

module.exports = {
  full: () => theChain.load(),
  addTransaction: (transaction) => {
    const currentPage = theChain.load()
      .slice(-1)
      .pop()
      .pageContent
    currentPage.transactions = [ transaction, ...currentPage.transactions ]
  },
  mine: () => {
    const currentChain = theChain.load()
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

      theChain.save(addPage(currentChain, newPage))
    }
  },
  inspect: () => pipe(
    theChain.load(),
    () => true,
    () => false)(
      chainingHashInspector,
      hashVerification),
  tamper: () => pipe(
        theChain.load(),
        (theChain) => theChain.save())
        (tampering)
}
