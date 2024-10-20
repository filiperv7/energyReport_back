import { ResponseListInvoicesType } from '../dto/ResponseListInvoicesType'

export class InvoicesOutput {
  getInvoicesByClientOutput(
    invoice: any,
    total: number
  ): ResponseListInvoicesType {
    return {
      id: invoice.id,
      reference_date: `${invoice.month}/${invoice.year}`,
      distributor_name: invoice.distributor,
      client_name: invoice.client.client_name,
      total: total,
      economy: invoice.value_of_compensated_energy,
      flag_color: invoice.flag_color,
      path: invoice.path
    }
  }

  getInvoiceByIdOutput(
    invoice: any,
    totalWithoutGD: number,
    totalToPay: number,
    electricityConsumption: number,
    averageDailySpeding: number,
    averageDailySpedingInReais: number
  ) {
    return {
      id: invoice.id,
      reference_date: `${invoice.month}/${invoice.year}`,
      distributor_name: invoice.distributor,
      client_name: invoice.client.client_name,
      client_number: invoice.client.client_number,
      flag_color: invoice.flag_color,
      path: invoice.path,

      electricity_consumption: electricityConsumption,
      refund_of_payment: invoice.refund_of_payment,
      total_without_GD: totalWithoutGD,
      total_to_pay: totalToPay,
      average_daily_spending: averageDailySpeding,
      average_daily_spending_in_reais: averageDailySpedingInReais,

      economy: invoice.value_of_compensated_energy,
      compensated_energy: invoice.amount_of_compensated_energy
    }
  }
}
