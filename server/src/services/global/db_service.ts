import { Pool } from "pg";

/** Service that allows interfacing with a persistent storage. */
export interface DatabaseService {
    query: (queryString: string, values?: any[]) => any,
}

export const usePSQLDBService = (pool: Pool): DatabaseService => {
    return {
        async query(queryString, values) {
            const res = await pool.query(queryString, values);
            return res;
        }
    };
};