"use strict"

const chain = require("../src/chain")

describe("Chain Functionalities", () => {
  test("Create new chain with an empty page", () => {
    expect(chain.full()).toEqual([{
      pageContent: {
        transactions: [ ],
        previousPageHash: "",
        padding: "",
      },
      pageHash: "",
    }])
  })
})

describe("Chain Integrity Check", () => {
  test("A page has incorrect previous page hash", () => {})
  test("A page has an invalid page hash", () => {})
})
