import { container, injectable } from 'tsyringe'
import { PrismaService } from '../../PrismaService'

@injectable()
export class CreateClientRepository {
  private prisma: PrismaService

  constructor() {
    this.prisma = container.resolve(PrismaService)
  }

  async createNewClient(client: ClientType) {
    try {
      const newClient = await this.prisma.client.clients.create({
        data: {
          client_name: client.clientName,
          client_number: client.clientNumber
        }
      })

      if (newClient) return newClient

      return false
    } catch (error) {
      return false
    }
  }
}
