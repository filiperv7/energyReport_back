import { container, injectable } from 'tsyringe'
import { PrismaService } from '../../PrismaService'
import { InvoiceType } from '../../types/InvoiceType'

@injectable()
export class FindInvoiceRepository {
  private prisma: PrismaService

  constructor() {
    this.prisma = container.resolve(PrismaService)
  }

  async checkIfInvoiceAlreadyExists(invoice: InvoiceType) {
    try {
      const invoiceExist = await this.prisma.client.invoices.findFirst({
        where: {
          month: invoice.month,
          year: invoice.year
        }
      })

      if (invoiceExist) return invoiceExist

      return false
    } catch {
      return false
    }
  }

  async getInvoicesByClientService(clientNumber: string) {
    try {
      const invoices = await this.prisma.client.invoices.findMany({
        select: {
          id: true,
          client: true,
          month: true,
          year: true,
          distributor: true,
          flag_color: true,

          value_of_compensated_energy: true,
          value_of_electrical_energy: true,
          value_of_SCEE_energy: true,
          municipal_public_lighting_contrib: true
        },
        where: {
          client: {
            client_number: clientNumber
          }
        }
      })

      if (invoices) return invoices

      return false
    } catch {
      return false
    }
  }
}
