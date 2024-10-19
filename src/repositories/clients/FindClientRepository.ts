import { container, injectable } from 'tsyringe'
import { PrismaService } from '../../PrismaService'

@injectable()
export class FindClientRepository {
  private prisma: PrismaService

  constructor() {
    this.prisma = container.resolve(PrismaService)
  }

  async checkIfClientAlreadyExists(clientNumber: string) {
    try {
      const clientExist = await this.prisma.client.clients.findFirst({
        where: {
          client_number: clientNumber
        }
      })

      if (clientExist) return clientExist.id

      return false
    } catch (error) {
      return false
    }
  }
}
