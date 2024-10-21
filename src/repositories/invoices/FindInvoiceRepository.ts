import { container, injectable } from 'tsyringe'
import { PrismaService } from '../../PrismaService'
import { InvoiceType } from '../../types/InvoiceType'

@injectable()
export class FindInvoiceRepository {
  private prisma: PrismaService

  constructor() {
    this.prisma = container.resolve(PrismaService)
  }

  async checkIfInvoiceAlreadyExists(invoice: InvoiceType, idClient: number) {
    try {
      const invoiceExist = await this.prisma.client.invoices.findFirst({
        where: {
          month: invoice.month,
          year: invoice.year,
          client: { id: idClient }
        }
      })

      if (invoiceExist) return invoiceExist

      return false
    } catch {
      return false
    }
  }

  async getInvoicesByClient(clientNumber: string) {
    try {
      const invoices = await this.prisma.client.invoices.findMany({
        select: {
          id: true,
          client: true,
          month: true,
          year: true,
          distributor: true,
          flag_color: true,
          path: true,

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

  async getInvoiceById(id: number) {
    try {
      const invoice = await this.prisma.client.invoices.findUnique({
        select: {
          id: true,
          client: true,
          month: true,
          year: true,
          distributor: true,
          flag_color: true,
          installation_number: true,
          path: true,

          refund_of_payment: true,
          damage_reimbursement: true,
          value_of_compensated_energy: true,
          amount_of_compensated_energy: true,
          value_of_electrical_energy: true,
          amount_of_electrical_energy: true,
          value_of_SCEE_energy: true,
          amount_of_SCEE_energy: true,
          municipal_public_lighting_contrib: true,
          amount_of_days: true
        },
        where: {
          id: Number(id)
        }
      })

      if (invoice) return invoice

      return false
    } catch {
      return false
    }
  }
}
