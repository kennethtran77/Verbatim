import { closeTestPool } from "../helpers/test_db";

/** Closes the pg pool once all tests have finished. */
export async function teardown(): Promise<void> {
    await closeTestPool();
}
