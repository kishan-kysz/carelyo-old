import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
	/*
	 * Specify what prefix the client-side variables must have.
	 * This is enforced both on type-level and at runtime.
	 */
	clientPrefix: 'VITE_',
	server: {},
	client: {
		VITE_API_URL: z.string().url(),
		VITE_DOMAIN: z.string(),
		VITE_LOGIN_URL: z.string().url(),
		VITE_PROVIDER_NAME: z.string(),
		VITE_PROVIDER_HEX_COLOR: z.string(),
		VITE_POLLING_RATE: z
			.string()
			.transform((v) => parseInt(v, 10))
			.pipe(z.number()),
		VITE_BUILD_ID: z.string().default(''),
		VITE_DEBUG_SLEEP: z.string().default('false'),
		VITE_DEBUG_SLEEP_TIME_MS: z
			.string()
			.transform((v) => parseInt(v, 10))
			.pipe(z.number())
			.default('1000'),
		VITE_STRIPE_PUBLIC_API_KEY: z.string(),
		VITE_DEFAULT_PHONE_NUMBER_COUNTRY : z.string(),
		VITE_DEFAULT_COUNTRY : z.string()
	
	},
	/**
	 * What object holds the environment variables at runtime.
	 * Often `process.env` or `import.meta.env`
	 */
	runtimeEnv: import.meta.env,
	skipValidation:
		!!import.meta.env.SKIP_ENV_VALIDATION &&
		import.meta.env.SKIP_ENV_VALIDATION !== 'false' &&
		import.meta.env.SKIP_ENV_VALIDATION !== '0',
});
