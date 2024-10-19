import { ClientType } from './ClientType'
import { InvoiceType } from './InvoiceType'

export type ImportanteInvoiceDataType = {
  client: ClientType
  invoice: InvoiceType
  distributorName: string
}
