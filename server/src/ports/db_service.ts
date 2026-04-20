/** Service that allows interfacing with a persistent storage. */
export interface DatabaseService {
    query: (queryString: string, values?: any[]) => any;
}
