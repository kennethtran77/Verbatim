import { Pool } from "pg";
import { DatabaseService } from "../../ports/db_service";

export const usePSQLDBService = (pool: Pool): DatabaseService => ({
    async query(queryString, values) {
        const res = await pool.query(queryString, values);
        return res;
    },
});
