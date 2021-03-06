import { UserData } from '@/entities'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { badRequest, ok, serverError } from '@/web-controllers/util'
import { MissingParameterError } from '@/web-controllers/errors/missing-parameter-error'
import { UseCase } from '@/usecases/ports'

export class RegisterAndSendEmailController {
  private readonly usecase: UseCase

  constructor (usecase: UseCase) {
    this.usecase = usecase
  }

  public async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      if (!request.body.name || !request.body.email) {
        let missingParam = !request.body.name ? 'name ' : ''
        missingParam += !request.body.email ? 'email' : ''
        return badRequest(new MissingParameterError(missingParam.trim()))
      }

      const userData: UserData = request.body
      const response = await this.usecase.perform(userData)

      if (response.isLeft()) {
        return badRequest(response.value)
      }

      return ok(response.value)
    } catch (error) {
      return serverError(error)
    }
  }
}
