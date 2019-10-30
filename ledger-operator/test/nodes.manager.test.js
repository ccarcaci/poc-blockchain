"use strict"

const { doPost } = require("../client")
const { Pure } = require("../nodes.manager")

jest.mock("../client")

describe("Propagation Functionalities", () => {
  beforeEach(() => doPost.mockReset())

  test("Call propagate returns the concatenation of knownNodes", () => {
    expect(Pure.merge(1, [ 2, 3 ], [ 4, 5, 6 ])).toStrictEqual([ 1, 2, 3, 4, 5, 6 ])
  })

  test("Propagation will remove duplicate nodes", () => {
    expect(Pure.merge(42, [ 42, 1 ], [ 42, 2 ])).toStrictEqual([ 42, 1, 2 ])
  })

  test("Ask to ref node its list of known nodes", (done) => {
    doPost.mockResolvedValue([ 42, 4242 ])
    const theCallback = (knownNodes) => {
      expect(knownNodes).toEqual([ 42, 4242 ])
      done()
    }
    Pure.initializeKnownNodes(1, theCallback)
  })

  test("Unknown nodes is the caller", () => {
    expect(Pure.unknowns(1, [], [42])).toStrictEqual([1])
  })

  test("Some nodes are unknown", () => {
    expect(Pure.unknowns(1, [ 2, 3, 4 ], [ 1, 2, 42 ])).toStrictEqual([ 3, 4 ])
  })

  test("Propagate all nodes", () => {
    doPost.mockResolvedValue([])
    Pure.propagate([ 1, 2, 3 ], () => {})
    expect(doPost.mock.calls.length).toBe(3)
    expect(doPost.mock.calls[0][0]).toStrictEqual(1)
    expect(doPost.mock.calls[1][0]).toStrictEqual(2)
    expect(doPost.mock.calls[2][0]).toStrictEqual(3)
  })
})
