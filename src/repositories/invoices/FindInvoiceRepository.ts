import { container, injectable } from 'tsyringe'
import { PrismaService } from '../../PrismaService'

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
    } catch (error) {
      return false
    }
  }
}
