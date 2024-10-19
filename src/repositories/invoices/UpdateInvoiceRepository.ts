import { container, injectable } from 'tsyringe'
import { PrismaService } from '../../PrismaService'

@injectable()
export class UpdateInvoiceRepository {
  private prisma: PrismaService

  constructor() {
    this.prisma = container.resolve(PrismaService)
  }

  async updateInvoiceWithPath(id: number, filePath: string) {
    try {
      const invoiceUpdated = await this.prisma.client.invoices.update({
        data: {
          path: filePath
        },
        where: { id: id }
      })

      return !!invoiceUpdated
    } catch {
      return false
    }
  }
}
