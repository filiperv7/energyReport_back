import { container, injectable } from 'tsyringe'
import { PrismaService } from '../../PrismaService'

@injectable()
export class DeleteInvoiceRepository {
  private prisma: PrismaService

  constructor() {
    this.prisma = container.resolve(PrismaService)
  }

  async DeleteInvoice(id: number) {
    try {
      const deleted = await this.prisma.client.invoices.delete({
        where: { id: id }
      })

      return !!deleted
    } catch {
      return false
    }
  }
}
