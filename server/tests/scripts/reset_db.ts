import { resetSchema, closeTestPool } from "../helpers/test_db";

(async () => {
    try {
        await resetSchema();
        console.log("The test DB schema has been reset");
    } finally {
        await closeTestPool();
    }
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
