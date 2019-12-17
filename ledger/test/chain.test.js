"use strict"

describe("Chain Functionalities", () => {
  afterEach(() => jest.resetModules())
  test("Create new chain with an empty page", () => {
    const chain = require("../src/chain")
    expect(chain.full()).toEqual([{
      pageContent: {
        transactions: [ ],
        previousPageHash: "",
        padding: "",
      },
      pageHash: "",
    }])
  })
  test("Add transaction to chain", () => {
    const chain = require("../src/chain")
    chain.addTransaction({ eenie: "meenie" })

    expect(chain.full()).toEqual([{
      pageContent: {
        transactions: [{ eenie: "meenie" }],
        previousPageHash: "",
        padding: "",
      },
      pageHash: "",
    }])
  })
  test("Mine new page", () => {
    const chain = require("../src/chain")
    const crypto = require("../src/crypto")
    jest.mock("../src/crypto.js")

    chain.addTransaction({ eenie: "meenie" })

    crypto.uuidv4.mockReturnValue("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx")
    crypto.sha3.mockReturnValue("42")
    crypto.verifyPOW.mockReturnValue(true)

    chain.mine()

    expect(chain.full()).toEqual([
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

describe("Chain Integrity Check", () => {
  test("A page has incorrect previous page hash", () => {})
  test("A page has an invalid page hash", () => {})
})
