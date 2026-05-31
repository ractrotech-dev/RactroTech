import { generateLibraryComponents } from '../../lib/component-library/generator';

const opts = {
  waveId: process.argv.includes('--wave')
    ? Number(process.argv[process.argv.indexOf('--wave') + 1])
    : undefined,
  target: process.argv.includes('--target')
    ? Number(process.argv[process.argv.indexOf('--target') + 1])
    : undefined,
};

const { components, stats } = generateLibraryComponents(opts);

console.log(JSON.stringify({ count: components.length, stats }, null, 2));
