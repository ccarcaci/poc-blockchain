/* eslint-disable max-lines-per-function */

"use strict"

const initialChain = [
  {
    pageContent: {
      transactions: [ ],
      previousPageHash: "",
      padding: "",
    },
    pageHash: "",
  },
]

describe("Chain Functionalities", () => {
  afterEach(() => jest.resetModules())
  test("Add transaction to chain", () => {
    const chain = require("../src/chain")

    expect(chain.addTransaction(initialChain, { eenie: "meenie" })).toEqual([{
      pageContent: {
        transactions: [{ eenie: "meenie" }],
        previousPageHash: "",
        padding: "",
      },
      pageHash: "",
    }])
  })
  test("Mine new page", () => {
    const crypto = require("../src/crypto")
    jest.mock("../src/crypto.js")
    crypto.uuidv4.mockReturnValue("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx")
    crypto.sha3.mockReturnValue("42")
    crypto.verifyPOW.mockReturnValue(true)

    const chain = require("../src/chain")

    const updatedChain = chain.addTransaction(initialChain, { eenie: "meenie" })

    expect(chain.mine(updatedChain)).toEqual([
      {
        pageContent: {
          transactions: [{ eenie: "meenie" }],
          previousPageHash: "",
          padding: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
        },
        pageHash: "42",
      },
      {
        pageContent: {
          transactions: [ ],
          previousPageHash: "42",
          padding: "",
        },
        pageHash: "",
      },
    ])
  })
})
