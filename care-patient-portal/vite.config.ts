import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import { exec } from 'child_process';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: 'build',
	},
	server: {
		open: true,
		port: 5511,
		host: true,
	},

	plugins: [
		react(),
		svgrPlugin(),
		{
			name: 'generate-build-id',
			closeBundle: async () => {
				// @ts-ignore
				exec('node generate-build-id.mjs', (err, stdout) => {
					if (err) {
						console.log(err);
						return;
					}
					console.log(stdout);
				});
			},
		},
	],
});
