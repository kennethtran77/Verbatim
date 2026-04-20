import { Router } from "express";
import { RequestHandler, RequestHandlerService, RequestMethod } from "../../ports/request_handler";

/** Uses the Express implementation of handling requests */
export const createExpressRequestHandler = (router: Router): RequestHandlerService => {
    // Registers a request handler for a specific HTTP method and path
    const register = (method: RequestMethod) => <T>(path: string, handler: RequestHandler<T>) => {
        router[method](path, async (req, res) => {
            const response = await handler({
                pathParams: req.params,
                queryParams: req.query,
                body: req.body,
            });
            res.status(response.success ? 200 : 400).json(response);
        });
    };
    return {
        get: register('get'),
        post: register('post'),
        delete: register('delete'),
    };
};
