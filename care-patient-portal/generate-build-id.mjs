import * as fs from 'fs';
import * as crypto from 'crypto';


const hash = crypto.createHash('sha1');
hash.update(fs.readFileSync('build/index.html'));
const buildId = hash.digest('hex');
process.env.VITE_BUILD_ID = buildId;

const args = process.argv.slice(2); // remove node and script name
const [command] = args;
if (command === '--write') {
	const envFile = fs.readFileSync('.env', 'utf8');
	const newEnvFile = envFile.replace(/VITE_BUILD_ID=.*/g, `VITE_BUILD_ID=${buildId}`);
	const previousBuildId = envFile.match(/VITE_BUILD_ID=(.*)/)?.[1];
	// compare the current Build ID with the new one and only write to the file if it has changed
	if (previousBuildId !== buildId) {
		// update the .env file with the new build id
		fs.writeFileSync('.env', newEnvFile);
		if (newEnvFile === envFile) {
			// if the file has not changed then append the new build id to the end of the file
			fs.appendFileSync('.env', `\nVITE_BUILD_ID=${buildId}`);
		}
	}
}

if(command === "--docker"){
	// create a BUILD_ID file in the build directory
	fs.writeFileSync('BUILD_ID', buildId);
}

console.log('buildId', process.env.VITE_BUILD_ID );
