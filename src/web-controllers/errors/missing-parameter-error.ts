export class MissingParameterError extends Error {
  public readonly name = 'MissingParameterError'

  constructor (param: string) {
    super(`Missing parameter from request: ${param}.`)
  }
}
