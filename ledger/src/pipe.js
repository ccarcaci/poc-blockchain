"use strict"

module.exports = (startingParams,
  okHandler = (stepsResult) => stepsResult,
  exceptionHandler = () => false) => (...steps) => {
  const stepsResult = steps.reduce((accumulator, currentStep) => {
    if(accumulator === undefined) { return undefined }

    return currentStep(accumulator)
  }, startingParams)

  if(stepsResult === undefined) { return exceptionHandler() }

  return okHandler(stepsResult)
}
