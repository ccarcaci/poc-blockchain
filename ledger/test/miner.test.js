"use strict"

const miner = require("../src/miner")
const page = require("../src/page")

jest.mock("../src/page.js")

describe("Do mining", () => {
  afterEach(() => jest.clearAllMocks())

  test("Mining round fails", () => {
    page.getCurrent.mockReturnValue([])
    page.addPadding.mockReturnValue([])
    page.verifyPOW.mockReturnValue(false)

    expect(miner.mine()).toBeFalsy()

    expect(page.getCurrentPageContent).toBeCalledTimes(1)
    expect(page.addPadding).toBeCalledTimes(1)
    expect(page.verifyPOW).toBeCalledTimes(1)
  })
  test("POW verified", () => {
    page.getCurrentPageContent.mockReturnValue([])
    page.addPadding.mockReturnValue([])
    page.verifyPOW.mockReturnValue(true)

    expect(miner.mine()).toBeTruthy()

    expect(page.getCurrentPageContent).toBeCalledTimes(1)
    expect(page.addPadding).toBeCalledTimes(1)
    expect(page.verifyPOW).toBeCalledTimes(1)
  })
})
