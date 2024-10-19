import PdfParse from 'pdf-parse'
import { injectable } from 'tsyringe'

@injectable()
export class ExtractInvoiceService {
  private dataExtractFromInvoice: ImportanteInvoiceDataType

  constructor() {
    this.dataExtractFromInvoice = {
      client: {} as ClientType,
      invoice: {} as InvoiceType
    } as ImportanteInvoiceDataType
  }

  private isPDFValid(fileBuffer: Buffer): boolean {
    const header = fileBuffer.slice(0, 4).toString('utf8')
    return header === '%PDF'
  }

  async extractInvoice(fileBuffer: Buffer): Promise<ImportanteInvoiceDataType> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.isPDFValid(fileBuffer)) {
          throw new Error('Invalid PDF file')
        }

        const allDataExtracted = await this.extractTextFromPDF(fileBuffer)
        const text = allDataExtracted.text

        this.extractClientNumber(text)
        this.extractInstallationNumber(text)
        this.extractReferenceDate(text)
        this.extractElectricEnergy(text)
        this.extractEnergySCEE(text)
        this.extractCompensatedEnergy(text)
        this.extractMunicipalPublicLightingContribution(text)
        this.extractDistributor(text)
        this.extractClientName(text)
        this.extractRefundOfPayment(text)
        this.extractFlagColor(text)
        this.extractDays(text)

        resolve(this.dataExtractFromInvoice)
      } catch (error) {
        console.error('Erro ao processar o PDF:', error)
        reject(error)
      }
    })
  }

  private async extractTextFromPDF(
    fileBuffer: Buffer
  ): Promise<PdfParse.Result> {
    const pdf = await PdfParse(fileBuffer)

    return pdf
  }

  private extractDistributor(text: string): void {
    const regex = /(CEMIG DISTRIBUIÇÃO S.A.) CNPJ 06.981.180\/0001-16/
    const match = text.match(regex)
    if (match) this.dataExtractFromInvoice.distributorName = match[1]
  }

  private extractClientName(text: string): void {
    const regex = /([^\n]+)\n(?:[^\n]+\n){3}CNPJ/
    const match = text.match(regex)
    if (match) this.dataExtractFromInvoice.client.clientName = match[1]
  }

  private extractClientNumber(text: string): void {
    const regex = /Nº DA INSTALAÇÃO\s+(\d+)/
    const match = text.match(regex)

    if (match) this.dataExtractFromInvoice.client.clientNumber = match[1]
  }

  private extractInstallationNumber(text: string): void {
    const regex = /Nº DA INSTALAÇÃO\s+\d+\s+(\d+)/
    const match = text.match(regex)

    if (match) {
      this.dataExtractFromInvoice.invoice.installationNumber = match[1]
    }
  }

  private extractReferenceDate(text: string): void {
    const regex = /Vencimento\s+Valor a pagar \(R\$\)\n\s+(\w{3}\/\d{4})/
    const match = text.match(regex)
    if (match) {
      const [month, year] = match[1].split('/')
      this.dataExtractFromInvoice.invoice.month = String(month)
      this.dataExtractFromInvoice.invoice.year = Number(year)
    }
  }

  private extractDays(text: string): void {
    const regex = /\s*\d{2}\/\d{2}\s*\d{2}\/\d{2}\s([\d{2}]+)\d{2}\/\d{2}/
    const match = text.match(regex)
    if (match)
      this.dataExtractFromInvoice.invoice.amountOfDays = Number(match[1])
  }

  private extractElectricEnergy(text: string): void {
    const regex = /Energia Elétrica\s*kWh\s+(\d{1,4})\s+\d+,\d+\s+([\d.,]+)/
    const match = text.match(regex)

    if (match) {
      this.dataExtractFromInvoice.invoice.amountOfElectricalEnergy = Number(
        match[1].replace('.', '').replace(',', '.')
      )
      this.dataExtractFromInvoice.invoice.valueOfElectricalEnergy = Number(
        match[2].replace('.', '').replace(',', '.')
      )
    }
  }

  private extractEnergySCEE(text: string): void {
    const regex =
      /Energia SCEE\s*(?:s\/? ICMS)?\s*kWh\s+([\d.,]+)\s+\d+,\d+\s+([\d.,]+)/i
    const match = text.match(regex)

    if (match) {
      this.dataExtractFromInvoice.invoice.amountOfSCEEEnergy = Number(
        match[1].replace('.', '').replace(',', '.')
      )
      this.dataExtractFromInvoice.invoice.valueOfSCEEEnergy = Number(
        match[2].replace('.', '').replace(',', '.')
      )
    }
  }

  private extractCompensatedEnergy(text: string): void {
    const regex =
      /Energia compensada\s*.*?kWh\s+([\d.,]+)\s+\d+,\d+\s+-?([\d.,]+)/i
    const match = text.match(regex)

    if (match) {
      this.dataExtractFromInvoice.invoice.amountOfCompensatedEnergy = Number(
        match[1].replace('.', '').replace(',', '.')
      )
      this.dataExtractFromInvoice.invoice.valueOfCompensatedEnergy = Number(
        match[2].replace('.', '').replace(',', '.')
      )
    }
  }

  private extractMunicipalPublicLightingContribution(text: string): void {
    const regex = /Contrib Ilum Publica Municipal\s+([\d.,]+)/
    const match = text.match(regex)

    if (match)
      this.dataExtractFromInvoice.invoice.municipalPublicLightingContrib =
        Number(match[1].replace(',', '.'))
  }

  private extractRefundOfPayment(text: string): void {
    const regex = /Restituição de Pagamento\s+-?([\d.,]+)/
    const match = text.match(regex)
    if (match)
      this.dataExtractFromInvoice.invoice.refundOfPayment = Number(match[1])
  }

  private extractFlagColor(text: string): void {
    const regex =
      /Bandeira (Verde|Amarela|Vermelha) - Já Incluído no valor a pagar/
    const match = text.match(regex)
    if (match) {
      const colorMap: { [key: string]: string } = {
        Verde: '#32a852',
        Amarela: '#f5ed05',
        Vermelha: '#f50505'
      }

      this.dataExtractFromInvoice.invoice.flagColor = colorMap[match[1]]
    }
  }
}
