import { Upload } from '@aws-sdk/lib-storage'
import crypto from 'crypto'
import { injectable } from 'tsyringe'
import { s3 } from '../../aws-config'

@injectable()
export class UploadInvoiceService {
  async upload(fileBuffer: Buffer, originalName: string) {
    const fileName = this.generateFileName(originalName)

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME || 'energyreportfilipe',
      Key: `invoices/${fileName}`,
      Body: fileBuffer,
      ContentType: 'application/pdf'
    }

    const upload = new Upload({
      client: s3,
      params: params
    })

    try {
      const uploadResult = await upload.done()

      return uploadResult
    } catch (error) {
      console.error('Erro ao subir o arquivo para o S3:', error)
      throw new Error('Falha ao fazer upload do PDF')
    }
  }

  private generateFileName(originalName: string): string {
    const timestamp = Date.now().toString()
    const hash = crypto
      .createHash('sha256')
      .update(timestamp)
      .digest('hex')
      .substring(0, 7)

    const formattedName = originalName.split('.').shift()

    return `${formattedName}_${hash}.pdf`
  }
}
