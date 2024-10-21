import { container, injectable } from 'tsyringe'
import { InvoicesOutput } from '../../output/InvoicesOutput'
import { FindInvoiceRepository } from '../../repositories/invoices/FindInvoiceRepository'

@injectable()
export class DashboardService {
  private findInvoiceRepository: FindInvoiceRepository
  private out: InvoicesOutput

  constructor() {
    this.findInvoiceRepository = container.resolve(FindInvoiceRepository)
    this.out = container.resolve(InvoicesOutput)
  }

  async getDashboardData(idInvoice: number) {
    const dashboardToData = await this.findInvoiceRepository.getInvoiceById(
      idInvoice
    )

    let dashboardData = {}
    if (dashboardToData) {
      const totalWithoutGD = parseFloat(
        (
          dashboardToData.value_of_electrical_energy +
          dashboardToData.value_of_SCEE_energy +
          dashboardToData.municipal_public_lighting_contrib
        ).toFixed(2)
      )

      const totalToPay = parseFloat(
        (
          dashboardToData.value_of_electrical_energy +
          dashboardToData.value_of_SCEE_energy +
          dashboardToData.municipal_public_lighting_contrib -
          dashboardToData.value_of_compensated_energy -
          (dashboardToData.refund_of_payment ?? 0) -
          (dashboardToData.damage_reimbursement ?? 0)
        ).toFixed(2)
      )

      const electricityConsumption =
        dashboardToData.amount_of_electrical_energy +
        dashboardToData.amount_of_SCEE_energy

      const averageDailySpeding = parseFloat(
        (electricityConsumption / dashboardToData.amount_of_days).toFixed(2)
      )

      const averageDailySpedingInReais = parseFloat(
        (totalWithoutGD / dashboardToData.amount_of_days).toFixed(2)
      )

      dashboardData = this.out.getInvoiceByIdOutput(
        dashboardToData,
        totalWithoutGD,
        totalToPay,
        electricityConsumption,
        averageDailySpeding,
        averageDailySpedingInReais
      )

      return { message: 'Dados do Dashboard', dashboardData, status: 200 }
    }

    return { message: 'Fatura não encontrada!', dashboardData, status: 404 }
  }
}
