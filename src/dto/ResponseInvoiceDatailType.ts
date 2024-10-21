export type ResponseInvoiceDetailType = {
  id: number
  reference_date: string
  distributor_name: string
  client_name: string
  client_number: string
  flag_color: string
  path: string

  electricity_consumption: number
  refund_of_payment: number
  total_without_GD: number
  total_to_pay: number
  average_daily_spending: number
  average_daily_spending_in_reais: number

  economy: number
  compensated_energy: number
}
