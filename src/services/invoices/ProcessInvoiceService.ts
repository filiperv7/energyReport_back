import { container, injectable } from 'tsyringe'
import { CreateClientRepository } from '../../repositories/clients/CreateClientRepository'
import { FindClientRepository } from '../../repositories/clients/FindClientRepository'
import { CreateInvoiceRepository } from '../../repositories/invoices/CreateInvoiceRepository'
import { DeleteInvoiceRepository } from '../../repositories/invoices/DeleteInvoiceRepository'
import { FindInvoiceRepository } from '../../repositories/invoices/FindInvoiceRepository'
import { UpdateInvoiceRepository } from '../../repositories/invoices/UpdateInvoiceRepository'
import { ExtractInvoiceService } from './ExtractInvoiceService'
import { UploadInvoiceService } from './UploadInvoiceService'

@injectable()
export class ProcessInvoiceService {
  private processInvoiceService: ExtractInvoiceService
  private uploadInvoiceService: UploadInvoiceService
  private findClientRepository: FindClientRepository
  private createClientRepository: CreateClientRepository
  private createInvoiceRepository: CreateInvoiceRepository
  private findInvoiceRepository: FindInvoiceRepository
  private updateInvoiceRepository: UpdateInvoiceRepository
  private deleteInvoiceRepository: DeleteInvoiceRepository

  constructor() {
    this.processInvoiceService = container.resolve(ExtractInvoiceService)
    this.uploadInvoiceService = container.resolve(UploadInvoiceService)
    this.findClientRepository = container.resolve(FindClientRepository)
    this.createClientRepository = container.resolve(CreateClientRepository)
    this.createInvoiceRepository = container.resolve(CreateInvoiceRepository)
    this.findInvoiceRepository = container.resolve(FindInvoiceRepository)
    this.updateInvoiceRepository = container.resolve(UpdateInvoiceRepository)
    this.deleteInvoiceRepository = container.resolve(DeleteInvoiceRepository)
  }

  async processInvoice(fileBuffer: Buffer, fileName: string) {
    const enableS3Upload = process.env.ENABLE_S3_UPLOAD ?? 'false'

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
        invoiceData.invoice,
        idClient
      )

    if (!invoiceExist) {
      const newInvoice = await this.createInvoiceRepository.createNewInvoice(
        invoiceData.invoice,
        idClient,
        invoiceData.distributorName
      )

      if (!newInvoice) return { message: 'Erro ao tentar salvar arquivo!' }

      invoiceData.invoice.id = newInvoice.id

      let fileUploaded
      if (enableS3Upload === 'true') {
        fileUploaded = await this.uploadInvoiceService.upload(
          fileBuffer,
          fileName
        )

        if (fileUploaded && fileUploaded.Location !== undefined) {
          invoiceData.invoice.path = fileUploaded.Location

          await this.updateInvoiceRepository.updateInvoiceWithPath(
            newInvoice.id,
            fileUploaded.Location
          )
        }

        if (!fileUploaded) {
          await this.deleteInvoiceRepository.DeleteInvoice(newInvoice.id)
          return { message: 'Erro ao tentar fazer upload do arquivo!' }
        }
      }
    }

    if (invoiceExist) {
      invoiceData.invoice.path = invoiceExist.path!
      invoiceData.invoice.id = invoiceExist.id

      return { message: 'Fatura já existia na nossa base!', data: invoiceData }
    }

    return { message: 'Sucesso ao fazer upload!', data: invoiceData }
  }
}
