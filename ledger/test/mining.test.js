"use strict"

const nodesManager = require("../src/nodesManager")
const miner = require("../src/miner")

jest.mock("../src/miner.js")

describe("Do mining", () => {
  test("Run single failing mining round", () => {
    miner.getCurrentPageContent.mockResolvedValue([])
    miner.addPadding.mockResolvedValue([])
    miner.verifyPOW.mockResolvedValue(false)

    nodesManager.Operations.mine()

    expect(miner.getCurrentPageContent).toBeCalledTimes(1)
    expect(miner.addPadding).toBeCalledTimes(1)
    expect(miner.verifyPOW).toBeCalledTimes(1)
  })
})
