import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { DashboardService } from './services/invoices/DashboardService'
import { GetInvoicesByClientService } from './services/invoices/GetInvoicesByClientService'
import { ProcessInvoiceService } from './services/invoices/ProcessInvoiceService'
import { TransformInFileBuffer } from './services/shared/TransformInFileBuffer'

export class Controller {
  private processInvoiceService: ProcessInvoiceService
  private getInvoicesByClientService: GetInvoicesByClientService
  private dashboardService: DashboardService

  constructor() {
    this.processInvoiceService = container.resolve(ProcessInvoiceService)
    this.getInvoicesByClientService = container.resolve(
      GetInvoicesByClientService
    )
    this.dashboardService = container.resolve(DashboardService)
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

    const response = await this.processInvoiceService.processInvoice(
      fileBuffer,
      file.file,
      file.filename
    )

    return reply.status(200).send(response)
  }

  async getInvoicesByClientNumber(
    request: FastifyRequest<{ Params: GetInvoicesByClientDto }>,
    reply: FastifyReply
  ) {
    const response = await this.getInvoicesByClientService.getInvoicesByClient(
      request.params.client_number
    )

    return reply.status(200).send(response)
  }

  async getDashboardData(
    req: FastifyRequest<{ Params: { id_invoice: number } }>,
    res: FastifyReply
  ) {
    const response = await this.dashboardService.getDashboardData(
      req.params.id_invoice
    )

    return res.status(response.status).send(response)
  }
}
