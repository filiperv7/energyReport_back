import { Readable } from 'stream'

export class TransformInFileBuffer {
  static async transform(fileStream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []

      fileStream.on('data', chunk => chunks.push(chunk))
      fileStream.on('end', () => resolve(Buffer.concat(chunks)))
      fileStream.on('error', err => {
        console.error('Erro ao processar o arquivo:', err)
        reject(err)
      })
    })
  }
}
