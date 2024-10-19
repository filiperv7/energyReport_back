import { FastifyInstance } from "fastify";
import { Controller } from "./Controller";

export const registerRoutes = (app: FastifyInstance) => {
    const controller = new Controller();

    app.post("/upload", (req, res) => controller.uploadInvoice(req, res))
}