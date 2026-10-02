//@ts-check
const path = require('node:path');
const dotenv = require('dotenv');

const workspaceRoot = path.join(__dirname, '../..');
dotenv.config({ path: path.join(workspaceRoot, '.env') });
dotenv.config({ path: path.join(workspaceRoot, '.env.local') });
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '.env.local') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@parishbooks/design-system', '@parishbooks/site-ui'],
};

module.exports = nextConfig;
