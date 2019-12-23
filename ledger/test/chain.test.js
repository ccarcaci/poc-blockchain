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
  beforeAll(() => jest.unmock("../src/crypto.js"))
  afterEach(() => jest.resetModules())
  test("Chain is valid", () => {
    const store = require("../src/store")
    jest.mock("../src/store.js")
    const currentChain = [
      {
        pageContent: {
          transactions: [ ],
          previousPageHash: "",
          padding: "",
        },
        pageHash: "7a70d0eecd5111f6368004577fbefd158de4a58e358885c6f21e2f59bdc744c8a27790f7ec9bec93bfe814a6b8421980ff8f9c5b8db88372601d1e04be0ba836",
      },
      {
        pageContent: {
          transactions: [ ],
          previousPageHash: "7a70d0eecd5111f6368004577fbefd158de4a58e358885c6f21e2f59bdc744c8a27790f7ec9bec93bfe814a6b8421980ff8f9c5b8db88372601d1e04be0ba836",
          padding: "",
        },
        pageHash: "97a25f02c821c0cc9837036a511b0967698c06650fbe7a1f57046f587ff1c73be06a4d3e17e02919657b203dc368915f3d73fb94de388b3e4279b2a27d03bb1b",
      },
      {
        pageContent: {
          transactions: [ ],
          previousPageHash: "97a25f02c821c0cc9837036a511b0967698c06650fbe7a1f57046f587ff1c73be06a4d3e17e02919657b203dc368915f3d73fb94de388b3e4279b2a27d03bb1b",
          padding: "",
        },
        pageHash: "",
      },
    ]
    store.initialize.mockReturnValue({
      save: () => {},
      load: () => currentChain
    })
    const chain = require("../src/chain")

    const inspectionResult = chain.inspect()

    expect(inspectionResult).toBe(true)
  })
  test("A page has incorrect previous page hash", () => {
    const store = require("../src/store")
    jest.mock("../src/store.js")
    const tamperedChain = [
      {
        pageContent: {
          transactions: [ ],
          previousPageHash: "",
          padding: "",
        },
        pageHash: "42",
      },
      {
        pageContent: {
          transactions: [ ],
          previousPageHash: "42",
          padding: "",
        },
        pageHash: "4242",
      },
      {
        pageContent: {
          transactions: [ ],
          previousPageHash: "4243",
          padding: "",
        },
        pageHash: "",
      },
    ]
    store.initialize.mockReturnValue({
      save: () => {},
      load: () => tamperedChain
    })
    const chain = require("../src/chain")
    
    const inspectionResult = chain.inspect()

    expect(inspectionResult).toBe(false)
  })
  test("A page has an invalid page hash", () => {})
})
