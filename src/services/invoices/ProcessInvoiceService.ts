import { container, injectable } from 'tsyringe'
import { CreateClientRepository } from '../../repositories/clients/CreateClientRepository'
import { FindClientRepository } from '../../repositories/clients/FindClientRepository'
import { CreateInvoiceRepository } from '../../repositories/invoices/CreateInvoiceRepository'
import { FindInvoiceRepository } from '../../repositories/invoices/FindInvoiceRepository'
import { ExtractInvoiceService } from './ExtractInvoiceService'

@injectable()
export class ProcessInvoiceService {
  private processInvoiceService: ExtractInvoiceService
  private findClientRepository: FindClientRepository
  private createClientRepository: CreateClientRepository
  private createInvoiceRepository: CreateInvoiceRepository
  private findInvoiceRepository: FindInvoiceRepository

  constructor() {
    this.processInvoiceService = container.resolve(ExtractInvoiceService)
    this.findClientRepository = container.resolve(FindClientRepository)
    this.createClientRepository = container.resolve(CreateClientRepository)
    this.createInvoiceRepository = container.resolve(CreateInvoiceRepository)
    this.findInvoiceRepository = container.resolve(FindInvoiceRepository)
  }

  async processInvoice(fileBuffer: Buffer) {
    const invoiceData = await this.processInvoiceService.extractInvoice(
      fileBuffer
    )

    if (
      !invoiceData ||
      invoiceData.client.clientNumber == undefined ||
      invoiceData.invoice.month == undefined
    )
      return { message: 'Erro ao extrair informações do arquivo!' }

    const clientExist =
      await this.findClientRepository.checkIfClientAlreadyExists(
        invoiceData.client.clientNumber
      )

    let idClient: number = 0

    if (!clientExist) {
      const newClient = await this.createClientRepository.createNewClient(
        invoiceData.client
      )

      if (!newClient) return { message: 'Erro ao tentar salvar Cliente!' }

      idClient = newClient.id
    }

    if (clientExist) idClient = clientExist

    invoiceData.client.id = idClient

    const invoiceExist =
      await this.findInvoiceRepository.checkIfInvoiceAlreadyExists(
        invoiceData.invoice
      )

    if (!invoiceExist) {
      const newInvoice = await this.createInvoiceRepository.createNewInvoice(
        invoiceData.invoice,
        idClient,
        invoiceData.distributorName
      )

      if (!newInvoice) return { message: 'Erro ao testar salvar arquivo!' }

      invoiceData.invoice.id = newInvoice.id
    }

    if (invoiceExist) invoiceData.invoice.id = invoiceExist.id

    return { message: 'Sucesso ao fazer upload!', data: invoiceData }
  }
}
