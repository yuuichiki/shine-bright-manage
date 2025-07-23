#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Start the API server
const apiServer = spawn('node', [path.join(__dirname, '../src/server/index.js')], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

apiServer.on('error', (err) => {
  console.error('Failed to start API server:', err);
});

apiServer.on('close', (code) => {
  console.log(`API server exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping API server...');
  apiServer.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  apiServer.kill('SIGTERM');
  process.exit(0);
});