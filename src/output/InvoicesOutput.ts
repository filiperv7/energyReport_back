import { ResponseListInvoicesType } from '../dto/ResponseListInvoicesType'

export class InvoicesOutput {
  GetInvoicesByClientOutput(
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
}
