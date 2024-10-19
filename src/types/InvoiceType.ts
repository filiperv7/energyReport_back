export type InvoiceType = {
  id?: number
  installationNumber: string
  month: string
  year: number
  amountOfElectricalEnergy: number
  valueOfElectricalEnergy: number
  amountOfSCEEEnergy: number
  valueOfSCEEEnergy: number
  amountOfCompensatedEnergy: number
  valueOfCompensatedEnergy: number
  municipalPublicLightingContrib: number
  amountOfDays: number
  refundOfPayment: number | null
  flagColor: string | null
}
