"use strict"

const page = require("../src/page")

jest.mock("../src/effort.js")

describe("Page Propagation", () => {
  test("Receive a new mined page, split current page content", () => {
    effort.verifyPOW.mockReturnValue(true)
    effort.getCurrentPageContent.mockReturnValue({
      transactions: [ 1, 2 ]
    })
    const newPage = { transactions: [ 1 ] }
  
    page.add(newPage)

    expect(effort.saveCurrentPage({
      transactions: [ 2 ]
    })).toBeCalledTimes(1)
  })
})
