// build-server.js
const { build } = require('esbuild');
const path = require('path');

build({
  entryPoints: [path.resolve(__dirname,'..', 'server/src/index.ts')],
  bundle: true,
  platform: 'node',
  outfile: path.resolve(__dirname,'..', 'dist-server/index.js'),
  format: 'cjs',
  external: [], // Include all dependencies
}).catch(() => process.exit(1));