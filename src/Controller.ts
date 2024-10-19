import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { ProcessInvoiceService } from './services/invoices/ProcessInvoiceService'
import { TransformInFileBuffer } from './services/shared/TransformInFileBuffer'

export class Controller {
  private invoiceUploadService: ProcessInvoiceService

  constructor() {
    this.invoiceUploadService = container.resolve(ProcessInvoiceService)
  }

  async uploadInvoice(request: FastifyRequest, reply: FastifyReply) {
    const file = await request.file()

    if (!file) {
      return reply
        .status(400)
        .send({ error: 'Arquivo não encontrado na requisição.' })
    }

    if (file.mimetype !== 'application/pdf') {
      return reply
        .status(400)
        .send({ error: 'Por favor, envie um arquivo PDF.' })
    }

    const fileBuffer = await TransformInFileBuffer.transform(file.file)

    if (!fileBuffer)
      return reply.status(500).send({ message: 'Erro ao processar arquivo!' })

    const data = await this.invoiceUploadService.processInvoice(fileBuffer)

    return reply.status(200).send(data)
  }
}
