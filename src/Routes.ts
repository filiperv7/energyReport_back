import { FastifyInstance, FastifyRequest } from 'fastify'
import { Controller } from './Controller'

export const registerRoutes = (app: FastifyInstance) => {
  const controller = new Controller()

  app.post('/upload', (req, res) => controller.uploadInvoice(req, res))
  app.get(
    '/invoices_by_client/:client_number',
    (req: FastifyRequest<{ Params: GetInvoicesByClientDto }>, res) =>
      controller.getInvoicesByClientNumber(req, res)
  )
  app.get(
    '/invoice/:id_invoice/dashboard',
    (req: FastifyRequest<{ Params: { id_invoice: number } }>, res) =>
      controller.getDashboardData(req, res)
  )
}
