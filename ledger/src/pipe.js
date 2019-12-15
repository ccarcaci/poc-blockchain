"use strict"

module.exports = (startingParams, ...steps) => {
    return steps.reduce((accumulator, currentStep) => {
      if(accumulator === undefined) { return undefined }

      return currentStep(accumulator)
    }, startingParams)
  }
