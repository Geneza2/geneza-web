import * as migration_20250725_084216 from './20250725_084216';

export const migrations = [
  {
    up: migration_20250725_084216.up,
    down: migration_20250725_084216.down,
    name: '20250725_084216'
  },
];
