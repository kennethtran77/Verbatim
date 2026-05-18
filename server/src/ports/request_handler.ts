import Response from "@verbatim/shared/response";

export default interface Request {
    pathParams?: any;
    queryParams?: any;
    body?: any;
}

/** A function that handles a request and returns a response */
export type RequestHandler<T> = (request: Request) => Response<T> | Promise<Response<T>>;

export type RequestMethod = 'get' | 'post' | 'delete';

/** A function that initializes REST routes given a request handler service */
export type RouteBinder = (requestHandler: RequestHandlerService) => void;

/** A request handling service */
export interface RequestHandlerService {
    get: <T>(path: string, handler: RequestHandler<T>) => void;
    post: <T>(path: string, handler: RequestHandler<T>) => void;
    delete: <T>(path: string, handler: RequestHandler<T>) => void;
}
