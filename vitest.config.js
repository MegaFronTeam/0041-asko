import {defineConfig} from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		include: [
			"tests/**/*.test.js",
			"tests/**/*.test.ts",
			"sourse/pug/blocks/**/*.test.js",
		],
		globals: true,
		testTimeout: 60000,
	},
});
