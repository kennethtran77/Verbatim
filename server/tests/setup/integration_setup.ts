import { beforeEach } from 'vitest';
import { truncateAll } from '../helpers/test_db';

// Truncates all data before each test
beforeEach(async () => {
    await truncateAll();
});
