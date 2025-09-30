/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

// Get the environment argument, defaulting to "development"
const env = process.env.BUILD_ENV || 'dev'; // Options: development, stg, production

// Define the corresponding environment file
const envFile = `.env.${env}`;
const targetFile = path.join(__dirname, '.env');

// Check if the environment file exists
if (!fs.existsSync(envFile)) {
  console.error(`❌ Error: ${envFile} does not exist.`);
  process.exit(1);
}

// Copy the correct environment file to `.env`
fs.copyFileSync(envFile, targetFile);
console.log(`✅ Successfully set environment: ${envFile} → .env`);
