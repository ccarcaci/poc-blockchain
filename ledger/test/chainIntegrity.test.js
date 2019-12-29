/* eslint-disable max-lines-per-function */

"use strict"

const crypto = require("../src/crypto")

jest.mock("../src/crypto.js")

describe("Chain Integrity Check", () => {
//  beforeEach(() => jest.resetModules())
  test("Chain is valid", () => {
    const currentChain = [
      {
        pageContent: {
          transactions: [ ],
          previousPageHash: "",
          padding: "",
        },
        // eslint-disable-next-line max-len
        pageHash: "4242",
      },
      {
        pageContent: {
          transactions: [ ],
          // eslint-disable-next-line max-len
          previousPageHash: "4242",
          padding: "",
        },
        // eslint-disable-next-line max-len
        pageHash: "4242",
      },
      {
        pageContent: {
          transactions: [ ],
          // eslint-disable-next-line max-len
          previousPageHash: "4242",
          padding: "",
        },
        pageHash: "",
      },
    ]
    crypto.sha3.mockReturnValue("4242")
    const chain = require("../src/chain")

    const inspectionResult = chain.inspect(currentChain)

    expect(inspectionResult).toBe(true)
    expect(crypto.sha3).toHaveBeenCalledTimes(2)
  })
  test("A page has incorrect previous page hash", () => {
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
    const chain = require("../src/chain")

    const inspectionResult = chain.inspect(tamperedChain)

    expect(inspectionResult).toBe(false)
    expect(crypto.sha3).not.toHaveBeenCalled()
  })
  test("A page has an invalid page hash", () => {
    const tamperedChain = [
      {
        pageContent: {
          transactions: [ ],
          previousPageHash: "",
          padding: "",
        },
        // eslint-disable-next-line max-len
        pageHash: "7a70d0eecd5111f6368004577fbefd158de4a58e358885c6f21e2f59bdc744c8a27790f7ec9bec93bfe814a6b8421980ff8f9c5b8db88372601d1e04be0ba837",
      },
      {
        pageContent: {
          transactions: [ ],
          // eslint-disable-next-line max-len
          previousPageHash: "7a70d0eecd5111f6368004577fbefd158de4a58e358885c6f21e2f59bdc744c8a27790f7ec9bec93bfe814a6b8421980ff8f9c5b8db88372601d1e04be0ba837",
          padding: "",
        },
        // eslint-disable-next-line max-len
        pageHash: "97a25f02c821c0cc9837036a511b0967698c06650fbe7a1f57046f587ff1c73be06a4d3e17e02919657b203dc368915f3d73fb94de388b3e4279b2a27d03bb1b",
      },
    ]
    const chain = require("../src/chain")

    const inspectionResult = chain.inspect(tamperedChain)

    expect(inspectionResult).toBe(false)
  })
  test("Tamper chain adding transaction to page", () => {
    let currentChain = [
      {
        pageContent: {
          transactions: [ ],
          previousPageHash: "",
          padding: "",
        },
        // eslint-disable-next-line max-len
        pageHash: "7a70d0eecd5111f6368004577fbefd158de4a58e358885c6f21e2f59bdc744c8a27790f7ec9bec93bfe814a6b8421980ff8f9c5b8db88372601d1e04be0ba836",
      },
      {
        pageContent: {
          transactions: [ ],
          // eslint-disable-next-line max-len
          previousPageHash: "7a70d0eecd5111f6368004577fbefd158de4a58e358885c6f21e2f59bdc744c8a27790f7ec9bec93bfe814a6b8421980ff8f9c5b8db88372601d1e04be0ba836",
          padding: "",
        },
        // eslint-disable-next-line max-len
        pageHash: "97a25f02c821c0cc9837036a511b0967698c06650fbe7a1f57046f587ff1c73be06a4d3e17e02919657b203dc368915f3d73fb94de388b3e4279b2a27d03bb1b",
      },
      {
        pageContent: {
          transactions: [ ],
          // eslint-disable-next-line max-len
          previousPageHash: "97a25f02c821c0cc9837036a511b0967698c06650fbe7a1f57046f587ff1c73be06a4d3e17e02919657b203dc368915f3d73fb94de388b3e4279b2a27d03bb1b",
          padding: "",
        },
        pageHash: "",
      },
    ]
    const chain = require("../src/chain")

    const tamperedChain = [
      {
        pageContent: {
          transactions: [ ],
          previousPageHash: "",
          padding: "",
        },
        // eslint-disable-next-line max-len
        pageHash: "7a70d0eecd5111f6368004577fbefd158de4a58e358885c6f21e2f59bdc744c8a27790f7ec9bec93bfe814a6b8421980ff8f9c5b8db88372601d1e04be0ba836",
      },
      {
        pageContent: {
          transactions: [
            { eenie: "meenie" }
          ],
          // eslint-disable-next-line max-len
          previousPageHash: "7a70d0eecd5111f6368004577fbefd158de4a58e358885c6f21e2f59bdc744c8a27790f7ec9bec93bfe814a6b8421980ff8f9c5b8db88372601d1e04be0ba836",
          padding: "",
        },
        // eslint-disable-next-line max-len
        pageHash: "97a25f02c821c0cc9837036a511b0967698c06650fbe7a1f57046f587ff1c73be06a4d3e17e02919657b203dc368915f3d73fb94de388b3e4279b2a27d03bb1b",
      },
      {
        pageContent: {
          transactions: [ ],
          // eslint-disable-next-line max-len
          previousPageHash: "97a25f02c821c0cc9837036a511b0967698c06650fbe7a1f57046f587ff1c73be06a4d3e17e02919657b203dc368915f3d73fb94de388b3e4279b2a27d03bb1b",
          padding: "",
        },
        pageHash: "",
      },
    ]

    expect(chain.tamper(currentChain)).toEqual(tamperedChain)
  })
})
