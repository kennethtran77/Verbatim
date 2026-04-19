import { Router } from "express";
import Response from "../../models/response";

export default interface Request {
    pathParams?: any;
    queryParams?: any;
    body?: any;
}

/** A function that handles a request and returns a response */
export type RequestHandler<T> = (request: Request) => Response<T> | Promise<Response<T>>;

export type RequestMethod = 'get' | 'post' | 'delete';

/** A request handling service */
export interface RequestHandlerService {
    // Defines a GET request handler for a specific path and response type
    get: <T>(path: string, handler: RequestHandler<T>) => void;
    // Defines a POST request handler for a specific path and response type
    post: <T>(path: string, handler: RequestHandler<T>) => void;
    // Defines a DELETE request handler for a specific path and response type
    delete: <T>(path: string, handler: RequestHandler<T>) => void;
}

/** Uses the Express implementation of handling requests */
export const useExpressRequestHandler = (router: Router): RequestHandlerService => {
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
}
