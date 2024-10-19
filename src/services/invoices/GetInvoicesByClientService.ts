import { container, injectable } from 'tsyringe'
import { ResponseListInvoicesType } from '../../dto/ResponseListInvoicesType'
import { InvoicesOutput } from '../../output/InvoicesOutput'
import { FindInvoiceRepository } from '../../repositories/invoices/FindInvoiceRepository'

@injectable()
export class GetInvoicesByClientService {
  private findInvoiceRepository: FindInvoiceRepository
  private out: InvoicesOutput

  constructor() {
    this.findInvoiceRepository = container.resolve(FindInvoiceRepository)
    this.out = container.resolve(InvoicesOutput)
  }

  async getInvoicesByClient(clientNumber: string) {
    const invoices =
      await this.findInvoiceRepository.getInvoicesByClientService(clientNumber)

    if (!invoices || invoices.length == 0)
      return { message: 'Nenhuma fatura encontrada!', invoices: {} }

    let formattedInvoices: ResponseListInvoicesType[] = []
    await Promise.all(
      invoices.map(invoice => {
        const total = parseFloat(
          (
            invoice.value_of_electrical_energy +
            invoice.value_of_SCEE_energy +
            invoice.municipal_public_lighting_contrib -
            invoice.value_of_compensated_energy
          ).toFixed(2)
        )

        formattedInvoices.push(
          this.out.GetInvoicesByClientOutput(invoice, total)
        )
      })
    )

    return { message: 'Faturas encontradas!', invoices: formattedInvoices }
  }
}
