"use strict"

const SHA3 = require("sha3")

module.exports = {
  verifyPOW: (pageHash) => pageHash.slice(0, 1) === "4",
  uuidv4: () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (chars) => {
    const random = Math.random() * 16 | 0, value = chars === "x" ? random : (random & 0x3 | 0x8)
    return value.toString(16)
  }),
  sha3: (pageContent) => {
    const hash = new SHA3(512)
    hash.update(JSON.stringify(pageContent))
    return hash.digest().toString("hex")
  },
}
