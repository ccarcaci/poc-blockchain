"use strict"

const { doPost } = require("../client")
const { Pure } = require("../nodes.manager")

jest.mock("../client")

describe("Propagation Functionalities", () => {
  beforeEach(() => doPost.mockReset())

  test("Call propagate returns the concatenation of knownNodes", () => {
    expect(Pure.propagate(1, [ 2, 3 ], [ 4, 5, 6 ])).toStrictEqual([ 1, 2, 3, 4, 5, 6 ])
  })

  test("Ask to ref node its list of known nodes", (done) => {
    doPost.mockResolvedValue([ 42, 4242 ])
    const theCallback = (knownNodes) => {
      expect(knownNodes).toEqual([ 42, 4242 ])
      done()
    }
    Pure.initializeKnownNodes(1, theCallback)
  })
})
