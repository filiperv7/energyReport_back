import { PrismaClient } from "@prisma/client"
import { singleton } from "tsyringe"

// export const prisma = new PrismaClient()

@singleton()
export class PrismaService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  get client(): PrismaClient {
    return this.prisma
  }
}
