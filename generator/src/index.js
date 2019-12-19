"use strict"

const bz2 = require("unbzip2-stream")
const fs = require("fs")
const path = require("path")
const stream = require("stream")

const configs = require("./configs")
const client = require("./client")
const transformations = require("./transformations")

const appDir = path.dirname(require.main.filename)

console.log(configs)

const send = new stream.Writable({
  write(chunk, _, callback) {
    client.doPost(configs.ledgerUrl, chunk.toString("utf-8"))
    callback()
  },
})

fs.createReadStream(`${appDir}/../reddit-repos/${configs.repoFilename}`)
  .pipe(bz2())
  .pipe(transformations.splittingLine)
  .pipe(transformations.makeValid)
  .pipe(transformations.wait(configs.minimumTime, configs.generatorInterval))
  .pipe(send)
