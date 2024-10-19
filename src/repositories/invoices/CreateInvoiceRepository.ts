import { container, injectable } from 'tsyringe'
import { PrismaService } from '../../PrismaService'

@injectable()
export class CreateInvoiceRepository {
  private prisma: PrismaService

  constructor() {
    this.prisma = container.resolve(PrismaService)
  }

  async createNewInvoice(
    invoice: InvoiceType,
    idClient: number,
    distributorName: string
  ) {
    try {
      const newInvoice = await this.prisma.client.invoices.create({
        data: {
          client: { connect: { id: idClient } },
          installation_number: invoice.installationNumber,
          distributor: distributorName,
          month: invoice.month,
          year: invoice.year,
          flag_color: invoice.flagColor,
          municipal_public_lighting_contrib:
            invoice.municipalPublicLightingContrib,
          refund_of_payment: invoice.refundOfPayment,

          amount_of_days: invoice.amountOfDays,
          amount_of_compensated_energy: invoice.amountOfCompensatedEnergy,
          value_of_compensated_energy: invoice.valueOfCompensatedEnergy,
          amount_of_electrical_energy: invoice.amountOfElectricalEnergy,
          value_of_electrical_energy: invoice.valueOfElectricalEnergy,
          amount_of_SCEE_energy: invoice.amountOfSCEEEnergy,
          value_of_SCEE_energy: invoice.valueOfSCEEEnergy
        }
      })

      if (newInvoice) return newInvoice

      return false
    } catch (error) {
      return false
    }
  }
}
