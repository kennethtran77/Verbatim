import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["tests/integration/**/*.test.ts"],
        globalSetup: ["./tests/setup/global_setup.ts"],
        setupFiles: ["./tests/setup/integration_setup.ts"],
        testTimeout: 10_000,
    },
});
