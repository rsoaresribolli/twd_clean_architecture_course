import { RegisterAndSendEmailController } from '@/web-controllers'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { MongodbUserRepository } from '@/external/repositories/mongodb'

export const makeRegisterUserController = (): RegisterAndSendEmailController => {
  const mongodbUserRepository = new MongodbUserRepository()
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(mongodbUserRepository)
  const registerUserController = new RegisterAndSendEmailController(registerUserOnMailingListUseCase)
  return registerUserController
}
