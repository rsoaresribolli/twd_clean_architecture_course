import { Either, left, Left, Right, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors/mail-service-error'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'
import { SendEmail } from '@/usecases/send-email/send-email'

const attachmentFilePath = '../resources/text.txt'
const fromName = 'Test'
const fromEmail = 'from_email@mail.com'
const toName = 'any_name'
const toEmail = 'any_email@mail.com'
const subject = 'Test e-mail'
const emailBody = 'Hello World attachment test'
const emailBodyHtml = '<b>Hello world attachment test</b>'
const attachment = [{
  filename: attachmentFilePath,
  contentType: 'text/plain'
}]

const mailOptions: EmailOptions = {
  host: 'test',
  port: 867,
  username: 'test',
  password: 'test',
  from: fromName + ' ' + fromEmail,
  to: toName + '<' + toEmail + '>',
  subject: subject,
  text: emailBody,
  html: emailBodyHtml,
  attachments: attachment
}

class MailServiceStub implements EmailService {
  async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(emailOptions)
  }
}

class MailServiceErrorStub implements EmailService {
  async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return left(new MailServiceError())
  }
}

describe('Send email to user', () => {
  test('should email user with valid name and email address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmail(mailOptions, mailServiceStub)
    const response = await useCase.perform({ name: toName, email: toEmail })
    expect(response).toBeInstanceOf(Right)
  })

  test('should not try to email user with invalid email address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmail(mailOptions, mailServiceStub)
    const invalidEmail = 'invalid_email'
    const response = await useCase.perform({ name: toName, email: invalidEmail })
    expect(response).toBeInstanceOf(Left)
  })

  test('should return error when email service fails', async () => {
    const mailServiceErrorStub = new MailServiceErrorStub()
    const useCase = new SendEmail(mailOptions, mailServiceErrorStub)
    const response = await useCase.perform({ name: toName, email: toEmail })
    expect(response.value).toBeInstanceOf(MailServiceError)
  })
})
