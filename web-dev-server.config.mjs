import {esbuildPlugin} from '@web/dev-server-esbuild';

export default {
  open: true,
  watch: true,
  nodeResolve: true,
  appIndex: 'testing/index.html',
  rootDir: '.',
  plugins: [esbuildPlugin({ts: true, target: 'auto'})],
};
