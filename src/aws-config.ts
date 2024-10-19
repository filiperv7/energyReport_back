import { S3Client } from '@aws-sdk/client-s3'

const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const region = process.env.AWS_REGION

if (!accessKeyId || !secretAccessKey || !region) {
  throw new Error(
    'AWS credentials and region must be defined in the environment variables'
  )
}

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

export { s3 }
