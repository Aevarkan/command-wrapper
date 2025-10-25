import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      "@minecraft/server": path.resolve(__dirname, "tests/mocks/@minecraft/server.ts"),
    },
  },
});